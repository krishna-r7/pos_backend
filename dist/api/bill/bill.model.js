"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillStatus = void 0;
const mongoose_1 = require("mongoose");
const itembill_model_1 = require("./itembill.model");
var BillStatus;
(function (BillStatus) {
    BillStatus["OPEN"] = "OPEN";
    BillStatus["COMPLETED"] = "COMPLETED";
})(BillStatus || (exports.BillStatus = BillStatus = {}));
const BillSchema = new mongoose_1.Schema({
    cashierId: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
    },
    status: {
        type: String,
        enum: BillStatus,
        default: BillStatus.OPEN,
    },
    items: [itembill_model_1.BillItemSchema],
    subTotal: {
        type: Number,
        required: true,
        default: 0,
    },
    totalDiscount: {
        type: Number,
        required: true,
        default: 0,
    },
    finalPayableAmount: {
        type: Number,
        required: true,
        default: 0,
    },
    generatedAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });
BillSchema.index({ cashierId: 1, status: 1 });
exports.default = (0, mongoose_1.model)("Bill", BillSchema);
