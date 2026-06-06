const Express = require("express");
const router = Express.Router();
const { 
    SignupUser, 
    LoginUser, 
    GetAllUsers, 
    DeleteUser, 
    UpdateProfile, 
    GetUserStats, 
    SendOtp, 
    VerifyOtp, 
    ChangePassword 
} = require("../Controllers/UserController");

// Authentication routes
router.post("/signup", SignupUser);
router.post("/login", LoginUser);

// OTP-based password reset routes
router.post("/send-otp", SendOtp);
router.post("/verify-otp", VerifyOtp);
router.post("/change-password", ChangePassword);

// User management routes
router.get("/", GetAllUsers);
router.get("/:id", GetUserStats);
router.put("/:id", UpdateProfile);
router.delete("/:id", DeleteUser);

module.exports = router;