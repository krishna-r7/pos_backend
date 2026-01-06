"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ItemSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        // required: true,
    },
    offers: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: "Offer",
        },
    ],
    isActive: {
        type: Boolean,
        default: true,
    },
    image: String,
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Item", ItemSchema);
