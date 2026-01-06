"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reapplyOfferForBillItem = exports.recalculateBillTotals = void 0;
const applyOffer_1 = require("./applyOffer");
const item_model_1 = __importDefault(require("../api/item/item.model"));
const recalculateBillTotals = (bill) => {
    const activeItems = bill.items.filter((i) => i.deletedAt === null);
    const subTotal = activeItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const finalPayableAmount = activeItems.reduce((sum, item) => sum + item.finalItemTotal, 0);
    return {
        subTotal,
        finalPayableAmount,
        totalDiscount: subTotal - finalPayableAmount,
    };
};
exports.recalculateBillTotals = recalculateBillTotals;
const reapplyOfferForBillItem = async (itemId, quantity) => {
    const item = await item_model_1.default.findById(itemId).populate("offers");
    if (!item) {
        throw new Error("Item not found");
    }
    const offerResult = await (0, applyOffer_1.applyOffer)(item.price, quantity, item.offers);
    return {
        unitPrice: item.price,
        availableOffer: {
            offerId: offerResult.offerId,
            offerName: offerResult.offerName,
            discountAmount: offerResult.discountAmount,
            freeQty: offerResult.freeQty,
            isApplied: offerResult.isApplied,
        },
        finalItemTotal: offerResult.finalTotal,
    };
};
exports.reapplyOfferForBillItem = reapplyOfferForBillItem;
