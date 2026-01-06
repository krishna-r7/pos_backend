"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfferType = void 0;
// models/Offer.ts
const mongoose_1 = require("mongoose");
var OfferType;
(function (OfferType) {
    OfferType["PERCENTAGE"] = "PERCENTAGE";
    OfferType["QUANTITY"] = "QUANTITY";
})(OfferType || (exports.OfferType = OfferType = {}));
const OfferSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: Object.values(OfferType),
        required: true,
    },
    // Percentage Discount
    discountPercent: Number,
    // Quantity Wise Discount
    minQty: Number,
    discountAmount: Number,
    priority: {
        type: Number,
        required: true, // lower number = higher priority
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    validFrom: Date,
    validTo: Date,
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Offer", OfferSchema);
