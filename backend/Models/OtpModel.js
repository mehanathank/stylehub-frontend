const mongoose = require("mongoose");

const OtpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    otp: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
        index: { expireAfterSeconds: 0 } // MongoDB TTL index to auto-delete expired docs
    },
    verified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create compound index for better performance
OtpSchema.index({ email: 1, otp: 1 });

module.exports = mongoose.model("Otp", OtpSchema);