const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, default: "-" },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

module.exports = mongoose.model("User", UserSchema);