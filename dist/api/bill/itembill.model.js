"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillItemSchema = void 0;
const mongoose_1 = require("mongoose");
exports.BillItemSchema = new mongoose_1.Schema({
    itemId: {
        type: mongoose_1.Types.ObjectId,
        ref: "Item",
        required: true,
    },
    itemName: String,
    unitPrice: Number,
    quantity: {
        type: Number,
        required: true,
    },
    availableOffer: {
        offerId: {
            type: mongoose_1.Types.ObjectId,
            ref: "Offer",
        },
        offerName: String,
        discountAmount: {
            type: Number,
            default: 0,
        },
        freeQty: {
            type: Number,
            default: 0,
        },
        isApplied: {
            type: Boolean,
            default: false,
        }
    },
    finalItemTotal: {
        type: Number,
        required: true,
    },
    deletedAt: {
        type: Date,
        default: null,
    },
});
