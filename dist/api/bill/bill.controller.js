"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillController = void 0;
const item_model_1 = __importDefault(require("../item/item.model"));
const applyOffer_1 = require("../../utils/applyOffer");
const bill_service_1 = require("./bill.service");
const bill_model_1 = __importStar(require("./bill.model"));
const bill_utils_1 = require("../../utils/bill.utils");
class BillController {
    constructor() {
        this.addItemToBill = async (req, res) => {
            try {
                const { itemId, quantity, cashierId } = req.body;
                const item = await item_model_1.default.findById(itemId).populate("offers");
                if (!item) {
                    res.status(404).json({ message: "Item not found" });
                    return;
                }
                const bill = await (0, bill_service_1.getOrCreateOpenBill)(cashierId);
                const alreadyExists = bill.items.some((i) => i.itemId.toString() === itemId && i.deletedAt === null);
                if (alreadyExists) {
                    return res.status(400).json({
                        message: "Item already added to bill. Update quantity instead.",
                    });
                }
                const offerResult = await (0, applyOffer_1.applyOffer)(item.price, quantity, item.offers);
                bill.items.push({
                    itemId: item._id,
                    itemName: item.name,
                    unitPrice: item.price,
                    quantity,
                    availableOffer: {
                        offerId: offerResult.offerId,
                        offerName: offerResult.offerName,
                        discountAmount: offerResult.discountAmount,
                        freeQty: offerResult.freeQty,
                        isApplied: offerResult.isApplied,
                    },
                    finalItemTotal: offerResult.finalTotal,
                });
                bill.subTotal = bill.items.reduce((sum, i) => sum + (i.unitPrice || 0) * i.quantity, 0);
                bill.finalPayableAmount = bill.items.reduce((sum, i) => sum + i.finalItemTotal, 0);
                bill.totalDiscount = bill.subTotal - bill.finalPayableAmount;
                await bill.save();
                return res.status(200).json({ status: 200, message: "Item added to bill", bill });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: "Failed to add item" });
            }
        };
        this.getCurrentBill = async (req, res) => {
            try {
                const cashierId = req.params.cashierId;
                console.log(cashierId);
                const bill = await bill_model_1.default.findOne({
                    cashierId,
                    status: bill_model_1.BillStatus.OPEN,
                });
                console.log(bill);
                if (!bill) {
                    res.status(200).json({ message: "Bill not found", items: [], subTotal: 0, totalDiscount: 0, finalPayableAmount: 0 });
                    return;
                }
                const activeItems = bill.items.filter((item) => item.deletedAt === null);
                const subTotal = activeItems.reduce((sum, i) => sum + (i.unitPrice || 0) * i.quantity, 0);
                const finalPayableAmount = activeItems.reduce((sum, i) => sum + i.finalItemTotal, 0);
                const totalDiscount = subTotal - finalPayableAmount;
                res.status(200).json({ status: 200,
                    items: activeItems,
                    subTotal,
                    totalDiscount,
                    finalPayableAmount,
                    id: bill._id,
                    message: "Bill fetched successfully",
                });
                // res.status(200).json({ message: "Bill fetched successfully", bill });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: "Failed to fetch bill" });
            }
        };
        this.createBill = async (req, res) => {
            try {
                const { billId } = req.params;
                const bill = await bill_model_1.default.findOne({
                    status: bill_model_1.BillStatus.OPEN,
                    _id: billId,
                });
                if (!bill || bill.items.length === 0) {
                    res.status(400).json({ status: 400, message: "No active bill found" });
                    return;
                }
                bill.status = bill_model_1.BillStatus.COMPLETED;
                bill.generatedAt = new Date();
                await bill.save();
                res.status(200).json({ status: 200, message: "Bill generated successfully", bill });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ status: 500, message: "Failed to generate bill" });
            }
        };
        this.updateItemQuantity = async (req, res) => {
            try {
                const { itemId, quantity, cashierId, billId, productId } = req.body;
                const bill = await bill_model_1.default.findOne({
                    status: bill_model_1.BillStatus.OPEN,
                    _id: billId,
                });
                if (!bill) {
                    res.status(404).json({ status: 400, message: "No active bill found" });
                    return;
                }
                const billItem = bill.items.find((i) => i._id.toString() === itemId);
                if (!billItem) {
                    res.status(404).json({ status: 400, message: "Item not found in bill" });
                    return;
                }
                const updatedItem = await (0, bill_utils_1.reapplyOfferForBillItem)(productId, quantity);
                billItem.quantity = quantity;
                billItem.availableOffer = updatedItem.availableOffer;
                billItem.finalItemTotal = updatedItem.finalItemTotal;
                const totals = (0, bill_utils_1.recalculateBillTotals)(bill);
                bill.subTotal = totals.subTotal;
                bill.finalPayableAmount = totals.finalPayableAmount;
                bill.totalDiscount = totals.totalDiscount;
                await bill.save();
                res.status(200).json({ status: 200, message: "Item quantity updated", bill });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ status: 500, message: "Failed to update quantity" });
            }
        };
        this.removeItemFromBill = async (req, res) => {
            try {
                const { itemId, billId } = req.body;
                const bill = await bill_model_1.default.findOne({
                    status: bill_model_1.BillStatus.OPEN,
                    _id: billId,
                });
                if (!bill) {
                    res.status(404).json({ status: 400, message: "No active bill found" });
                    return;
                }
                const billItem = bill.items.find((i) => i._id.toString() === itemId);
                if (!billItem) {
                    res.status(404).json({ status: 400, message: "Item not found in bill" });
                    return;
                }
                billItem.deletedAt = new Date();
                const activeItems = bill.items.filter(i => i.deletedAt === null);
                bill.subTotal = activeItems.reduce((sum, i) => sum + (i.unitPrice || 0) * i.quantity, 0);
                bill.finalPayableAmount = activeItems.reduce((sum, i) => sum + i.finalItemTotal, 0);
                bill.totalDiscount = bill.subTotal - bill.finalPayableAmount;
                await bill.save();
                res.status(200).json({ status: 200, message: "Item removed from bill", bill });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ status: 500, message: "Failed to remove item" });
            }
        };
        this.getHistory = async (req, res) => {
            try {
                const { cashierId } = req.query;
                let page = Number(req.query.page) || 1;
                let limit = Number(req.query.limit) || 10;
                let filter = { status: bill_model_1.BillStatus.COMPLETED };
                if (cashierId) {
                    filter.cashierId = cashierId;
                }
                const bills = await bill_model_1.default.find(filter).sort({ generatedAt: -1 }).skip((page - 1) * limit).limit(limit).lean();
                const cleanedBills = bills.map((bill) => ({
                    ...bill, items: bill.items.filter((item) => item.deletedAt === null),
                }));
                console.log(cleanedBills[0].items);
                const total = cleanedBills.length;
                const totalPages = Math.ceil(total / limit);
                res.status(200).json({ message: "Bill history fetched successfully",
                    bills: cleanedBills,
                    pagination: {
                        page,
                        limit,
                        total,
                        totalPages,
                    } });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: "Failed to fetch bill history" });
            }
        };
    }
}
exports.BillController = BillController;
;
