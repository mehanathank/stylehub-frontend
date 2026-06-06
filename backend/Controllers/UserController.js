const User = require("../Models/UserModel");
const Otp = require("../Models/OtpModel");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const { Resend } = require('resend');

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Generate secure 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Test email configuration on startup
const testEmailConfig = async () => {
    try {
        if (!process.env.RESEND_API_KEY) {
            console.error('❌ RESEND_API_KEY not configured');
            return false;
        }
        
        console.log('✅ Resend API Key configured');
        console.log('📧 Email service ready for OTP delivery');
        return true;
    } catch (error) {
        console.error('❌ Email configuration test failed:', error.message);
        return false;
    }
};

// Call test on module load
testEmailConfig();

const SignupUser = async (req, res) => {
    try {
        console.log("Mongoose readyState:", mongoose.connection.readyState);
        const { firstname, lastname, email, phone, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const NewUser = new User({ firstname, lastname, email, phone, password: hashedPassword });
        const SavedUser = await NewUser.save();

        res.status(200).json({
            message: "User Registered successfully",
            data: {
                id: SavedUser._id,
                firstname: SavedUser.firstname,
                lastname: SavedUser.lastname,
                email: SavedUser.email,
                phone: SavedUser.phone,
                role: SavedUser.role
            }
        });
    } catch (error) {
        res.status(400).json({ message: "User Registration failed", error: error.message });
    }
};

const LoginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) return res.status(400).json({ message: "User does not exist" });

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid password" });

        res.status(200).json({
            message: "Login successful",
            data: {
                id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });
    } catch (error) {
        res.status(400).json({ message: "Login failed", error: error.message });
    }
};

const GetAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: { $ne: 'admin' } }).select('-password').sort({ _id: -1 });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get users', error: error.message });
    }
};

const DeleteUser = async (req, res) => {
    try {
        const deleted = await User.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User deleted' });
    } catch (error) {
        res.status(400).json({ message: 'Failed to delete user', error: error.message });
    }
};

const UpdateProfile = async (req, res) => {
    try {
        const { firstname, lastname, phone, currentPassword, newPassword } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });
            user.password = await bcrypt.hash(newPassword, 10);
        }

        if (firstname) user.firstname = firstname;
        if (lastname !== undefined) user.lastname = lastname;
        if (phone) user.phone = phone;

        const saved = await user.save();
        res.status(200).json({
            message: 'Profile updated',
            data: { id: saved._id, firstname: saved.firstname, lastname: saved.lastname, email: saved.email, phone: saved.phone, role: saved.role }
        });
    } catch (error) {
        res.status(400).json({ message: 'Failed to update profile', error: error.message });
    }
};

const GetUserStats = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get user', error: error.message });
    }
};

// Send OTP using Resend
const SendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        
        // Validate input
        if (!email || !email.includes('@')) {
            return res.status(400).json({ message: 'Valid email is required' });
        }

        const normalizedEmail = email.toLowerCase().trim();
        console.log('🚀 SendOTP called for:', normalizedEmail);
        
        // Check if user exists
        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(404).json({ message: 'Email not registered with StyleHub' });
        }

        // Check for rate limiting (prevent spam)
        const recentOtp = await Otp.findOne({
            email: normalizedEmail,
            createdAt: { $gt: new Date(Date.now() - 60 * 1000) } // Within last 60 seconds
        });

        if (recentOtp) {
            return res.status(429).json({ 
                message: 'Please wait 60 seconds before requesting another OTP' 
            });
        }

        // Delete any existing OTPs for this email
        await Otp.deleteMany({ email: normalizedEmail });

        // Generate new OTP
        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Save OTP to database
        const newOtp = new Otp({
            email: normalizedEmail,
            otp,
            expiresAt
        });
        await newOtp.save();
        console.log('💾 OTP saved to database:', { email: normalizedEmail, otp, expiresAt });

        // Send email using Resend
        try {
            const emailData = {
                from: 'StyleHub <noreply@resend.dev>',
                to: [normalizedEmail],
                subject: 'StyleHub - Password Reset OTP',
                html: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1">
                        <title>StyleHub - Password Reset OTP</title>
                    </head>
                    <body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background-color:#f6f6f6;">
                        <div style="max-width:600px;margin:0 auto;background-color:#ffffff;">
                            <!-- Header -->
                            <div style="background-color:#8b4513;padding:40px 20px;text-align:center;">
                                <h1 style="color:#ffffff;margin:0;font-size:32px;font-weight:700;font-family:Georgia,serif;">StyleHub</h1>
                                <p style="color:#e0c9a6;margin:8px 0 0 0;font-size:16px;">Fashion E-Commerce</p>
                            </div>
                            
                            <!-- Content -->
                            <div style="padding:40px 30px;">
                                <h2 style="color:#6b3a2a;margin:0 0 20px 0;font-size:24px;">Password Reset Request</h2>
                                
                                <p style="color:#555555;font-size:16px;line-height:1.5;margin:0 0 20px 0;">
                                    Hi <strong>${user.firstname}</strong>,
                                </p>
                                
                                <p style="color:#555555;font-size:16px;line-height:1.5;margin:0 0 30px 0;">
                                    You requested to reset your StyleHub account password. Use the OTP below to proceed with your password reset:
                                </p>
                                
                                <!-- OTP Box -->
                                <div style="text-align:center;margin:40px 0;">
                                    <div style="background-color:#fdf6ee;border:3px dashed #8b4513;border-radius:16px;padding:30px;display:inline-block;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
                                        <div style="font-size:48px;font-weight:700;color:#8b4513;letter-spacing:8px;margin-bottom:10px;font-family:monospace;">${otp}</div>
                                        <div style="color:#666666;font-size:14px;font-weight:500;">Valid for 10 minutes</div>
                                    </div>
                                </div>
                                
                                <!-- Instructions -->
                                <div style="background-color:#f8f9fa;border-left:4px solid #28a745;padding:20px;margin:30px 0;border-radius:4px;">
                                    <h3 style="color:#155724;margin:0 0 15px 0;font-size:16px;">Security Instructions:</h3>
                                    <ul style="color:#155724;margin:0;padding-left:20px;font-size:14px;line-height:1.6;">
                                        <li>Enter this OTP on the StyleHub password reset page</li>
                                        <li>This OTP will expire in exactly 10 minutes</li>
                                        <li>Never share this OTP with anyone</li>
                                        <li>StyleHub will never ask for your OTP over phone or email</li>
                                    </ul>
                                </div>
                                
                                <!-- Support -->
                                <div style="background-color:#e8f4fd;border-radius:8px;padding:20px;margin:30px 0;">
                                    <p style="color:#0c5460;margin:0;font-size:14px;line-height:1.5;">
                                        <strong>Need Help?</strong><br>
                                        If you didn't request this password reset, please ignore this email. Your account security is important to us.
                                    </p>
                                </div>
                            </div>
                            
                            <!-- Footer -->
                            <div style="background-color:#f8f9fa;padding:30px;text-align:center;border-top:1px solid #dee2e6;">
                                <p style="color:#6c757d;margin:0 0 10px 0;font-size:14px;">
                                    © ${new Date().getFullYear()} StyleHub. All rights reserved.
                                </p>
                                <p style="color:#6c757d;margin:0;font-size:12px;">
                                    KK Nagar, Coimbatore | +91 9360553112 | stylehub@gmail.com
                                </p>
                            </div>
                        </div>
                    </body>
                    </html>
                `
            };

            const { data, error } = await resend.emails.send(emailData);
            
            if (error) {
                console.error('❌ Resend email error:', error);
                throw new Error(`Email sending failed: ${error.message}`);
            }

            console.log('✅ OTP email sent successfully via Resend:', {
                emailId: data.id,
                to: normalizedEmail,
                otp: otp,
                timestamp: new Date().toISOString()
            });
            
        } catch (emailError) {
            console.error('❌ Email sending failed:', emailError);
            // Clean up OTP from database if email fails
            await Otp.deleteMany({ email: normalizedEmail });
            throw new Error('Failed to send OTP email. Please try again.');
        }
        
        res.status(200).json({ 
            message: 'OTP sent successfully to your email',
            expiresIn: '10 minutes'
        });
        
    } catch (error) {
        console.error('💥 SendOTP error:', error);
        res.status(500).json({ 
            message: 'Failed to send OTP. Please try again later.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Verify OTP
const VerifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        
        // Validate input
        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' });
        }

        if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
            return res.status(400).json({ message: 'OTP must be a 6-digit number' });
        }

        const normalizedEmail = email.toLowerCase().trim();
        console.log('🔍 Verifying OTP for:', normalizedEmail, 'OTP:', otp);
        
        // Find valid OTP
        const otpRecord = await Otp.findOne({
            email: normalizedEmail,
            otp: otp,
            verified: false,
            expiresAt: { $gt: new Date() }
        });

        if (!otpRecord) {
            console.log('❌ OTP verification failed: Invalid or expired OTP');
            return res.status(400).json({ 
                message: 'Invalid or expired OTP. Please request a new one.' 
            });
        }

        // Mark OTP as verified (but don't delete yet - we'll need it for password change)
        otpRecord.verified = true;
        await otpRecord.save();
        
        console.log('✅ OTP verified successfully for:', normalizedEmail);

        res.status(200).json({ 
            message: 'OTP verified successfully',
            verified: true
        });
        
    } catch (error) {
        console.error('💥 VerifyOTP error:', error);
        res.status(500).json({ 
            message: 'OTP verification failed. Please try again.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Change password after OTP verification
const ChangePassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        
        // Validate input
        if (!email || !otp || !newPassword) {
            return res.status(400).json({ message: 'Email, OTP, and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        // Check for common weak passwords
        const weakPasswords = ['123456', 'password', '123456789', 'qwerty', 'abc123'];
        if (weakPasswords.includes(newPassword.toLowerCase())) {
            return res.status(400).json({ message: 'Please choose a stronger password' });
        }

        const normalizedEmail = email.toLowerCase().trim();
        console.log('🔐 Changing password for:', normalizedEmail);
        
        // Find verified OTP
        const otpRecord = await Otp.findOne({
            email: normalizedEmail,
            otp: otp,
            verified: true,
            expiresAt: { $gt: new Date() }
        });

        if (!otpRecord) {
            console.log('❌ Password change failed: Invalid session');
            return res.status(400).json({ 
                message: 'Invalid session. Please start the password reset process again.' 
            });
        }

        // Find user
        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 12); // Increased salt rounds for better security
        
        // Update user password
        user.password = hashedPassword;
        await user.save();

        // Delete the used OTP
        await Otp.deleteMany({ email: normalizedEmail });

        console.log('✅ Password reset successful for user:', normalizedEmail);
        
        res.status(200).json({ 
            message: 'Password reset successful. You can now login with your new password.' 
        });
        
    } catch (error) {
        console.error('💥 ChangePassword error:', error);
        res.status(500).json({ 
            message: 'Password reset failed. Please try again.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = {
    SignupUser,
    LoginUser,
    GetAllUsers,
    DeleteUser,
    UpdateProfile,
    GetUserStats,
    SendOtp,
    VerifyOtp,
    ChangePassword
};