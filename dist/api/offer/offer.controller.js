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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfferController = void 0;
const offer_model_1 = __importStar(require("./offer.model"));
class OfferController {
    constructor() {
        this.addOffer = async (req, res) => {
            try {
                const { name, type, priority, discountPercent, minQty, discountAmount, isActive, validFrom, validTo } = req.body;
                if (!name || !type || !priority) {
                    return res.status(400).json({ status: 400, message: "Name, type and priority are required" });
                }
                if (type === offer_model_1.OfferType.PERCENTAGE) {
                    if (!discountPercent) {
                        return res.status(400).json({ status: 400, message: "Discount percent is required for percentage offer" });
                    }
                    const offer = await offer_model_1.default.create({ name, type, discountPercent, priority, isActive, validFrom, validTo });
                    res.status(200).json({
                        message: "Offer created successfully",
                        data: offer,
                        status: 200,
                    });
                }
                else if (type === offer_model_1.OfferType.QUANTITY) {
                    if (!minQty || !discountAmount) {
                        return res.status(400).json({ status: 400, message: "Min qty and discount amount are required for quantity offer" });
                    }
                    const offer = await offer_model_1.default.create({ name, type, minQty, discountAmount, priority, isActive, validFrom, validTo });
                    res.status(200).json({
                        message: "Offer created successfully",
                        status: 200,
                        data: offer,
                    });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: "Failed to create offer" });
            }
        };
        this.getActiveOffers = async (req, res) => {
            try {
                let { page = 1, limit = 10, search = "" } = req.query;
                page = Number(page);
                limit = Number(limit);
                let filter = { isActive: true };
                if (search) {
                    filter.name = { $regex: search, $options: "i" };
                }
                const offers = await offer_model_1.default.find(filter).sort({ priority: -1 }).select("name  priority").skip((page - 1) * limit).limit(limit);
                const total = await offer_model_1.default.countDocuments(filter);
                const totalPages = Math.ceil(total / limit);
                res.status(200).json({
                    message: "Active offers fetched successfully",
                    data: offers,
                    pagination: {
                        total,
                        limit,
                        page,
                        totalPages,
                    }
                });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: "Failed to fetch active offers" });
            }
        };
        this.getAllOffers = async (req, res) => {
            try {
                let { page = 1, limit = 10, search = "" } = req.query;
                page = Number(page);
                limit = Number(limit);
                let filter = {};
                if (search) {
                    filter.name = { $regex: search, $options: "i" };
                }
                const offers = await offer_model_1.default.find(filter).sort({ priority: -1 }).skip((page - 1) * limit).limit(limit);
                const total = await offer_model_1.default.countDocuments(filter);
                const totalPages = Math.ceil(total / limit);
                res.status(200).json({
                    message: "All offers fetched successfully",
                    data: offers,
                    pagination: {
                        total,
                        limit,
                        page,
                        totalPages,
                    }
                });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: "Failed to fetch all offers" });
            }
        };
        this.updateStatus = async (req, res) => {
            try {
                const { id } = req.params;
                if (!id) {
                    return res.status(400).json({ status: 400, message: "ID is required" });
                }
                const offer = await offer_model_1.default.findById(id);
                if (!offer) {
                    return res.status(404).json({ status: 404, message: "Offer not found" });
                }
                offer.isActive = !offer.isActive;
                await offer.save();
                res.status(200).json({
                    message: "Offer status updated successfully",
                    status: 200,
                    data: offer,
                });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: "Failed to update offer status" });
            }
        };
    }
}
exports.OfferController = OfferController;
