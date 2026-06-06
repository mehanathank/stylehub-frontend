const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true, index: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    img: { type: String, required: true },
    colours: [{
        name: { type: String },
        img: { type: String }
    }],
    sizes: [{ type: String }],
    description: { type: String },
    details: [{ type: String }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Product", ProductSchema);
