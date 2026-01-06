"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemController = void 0;
const item_model_1 = __importDefault(require("./item.model"));
const offer_model_1 = __importDefault(require("../offer/offer.model"));
class ItemController {
    constructor() {
        this.addItem = async (req, res) => {
            try {
                const { name, price } = req.body;
                let { offerId } = req.body;
                if (!name || !price) {
                    return res.status(400).json({ status: 400, message: "Name and price are required" });
                }
                console.log("offerId:", offerId);
                console.log("typeof offerId:", typeof offerId);
                // console.log("offerId:", offerId);
                if (typeof offerId === "string") {
                    try {
                        offerId = JSON.parse(offerId);
                    }
                    catch {
                        offerId = offerId.split(",");
                    }
                }
                const offerIds = Array.isArray(offerId)
                    ? offerId
                    : offerId
                        ? [offerId]
                        : [];
                const offers = await offer_model_1.default.find({ _id: { $in: offerIds } });
                if (offers.length !== offerIds.length) {
                    return res.status(404).json({ status: 404, message: "One or more offers not found" });
                }
                const item = await item_model_1.default.create({ name, price });
                console.log("FILE:", req.file);
                if (req.file) {
                    const file = req.file;
                    const imageUrl = file.path;
                    item.image = imageUrl;
                }
                await item.save();
                const updatedItem = await item_model_1.default.findByIdAndUpdate(item._id, { $addToSet: { offers: offerId } }, { new: true }).populate("offers");
                res.status(200).json({
                    message: "Item created successfully",
                    data: updatedItem,
                    status: 200
                });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: "Failed to create item" });
            }
        };
        this.assignOffer = async (req, res) => {
            try {
                const { itemId, offerId } = req.body;
                if (!itemId || !offerId) {
                    return res.status(400).json({ status: 400, message: "Item ID and Offer ID are required" });
                }
                const item = await item_model_1.default.findById(itemId);
                if (!item) {
                    return res.status(404).json({ status: 404, message: "Item not found" });
                }
                const offer = await offer_model_1.default.findById(offerId);
                if (!offer) {
                    return res.status(404).json({ status: 404, message: "Offer not found" });
                }
                const updatedItem = await item_model_1.default.findByIdAndUpdate(itemId, { $addToSet: { offers: offerId } }, { new: true }).populate("offers");
                res.status(200).json({
                    message: "Offer assigned successfully",
                    status: 200,
                    data: updatedItem,
                });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: "Failed to assign offer" });
            }
        };
        this.getAllItems = async (req, res) => {
            try {
                let { page = 1, limit = 10, search = "" } = req.query;
                page = Number(page);
                limit = Number(limit);
                let filter = {};
                if (search) {
                    if (typeof search === "string") {
                        const trimmedSearch = search.trim();
                        filter = {
                            ...filter,
                            name: { $regex: trimmedSearch, $options: "i" },
                        };
                    }
                }
                const items = await item_model_1.default.find(filter).populate("offers").skip((page - 1) * limit).limit(limit);
                const totalItems = await item_model_1.default.countDocuments(filter);
                const totalPages = Math.ceil(totalItems / limit);
                res.status(200).json({
                    status: 200,
                    message: "Items fetched successfully",
                    data: items,
                    pagination: {
                        page,
                        limit,
                        totalItems,
                        totalPages,
                    },
                });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ status: 500, message: "Failed to fetch items" });
            }
        };
        this.getActiveItems = async (req, res) => {
            try {
                let { page = 1, limit = 10, search = "" } = req.query;
                page = Number(page);
                limit = Number(limit);
                let filter = { isActive: true };
                if (search) {
                    if (typeof search === "string") {
                        const trimmedSearch = search.trim();
                        filter = {
                            ...filter,
                            name: { $regex: trimmedSearch, $options: "i" },
                        };
                    }
                }
                const items = await item_model_1.default.find(filter).populate("offers").skip((page - 1) * limit).limit(limit);
                const totalItems = await item_model_1.default.countDocuments(filter);
                const totalPages = Math.ceil(totalItems / limit);
                res.status(200).json({
                    message: "Active Items fetched successfully",
                    data: items,
                    pagination: {
                        page,
                        limit,
                        totalItems,
                        totalPages,
                    },
                });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: "Failed to fetch active items" });
            }
        };
        this.updateItem = async (req, res) => {
            try {
                const itemId = req.params.itemId;
                const { name, price } = req.body;
                if (!itemId || !name || !price) {
                    return res.status(400).json({ status: 400, message: "Item ID, name, and  price are required" });
                }
                const item = await item_model_1.default.findById(itemId);
                if (!item) {
                    return res.status(404).json({ status: 404, message: "Item not found" });
                }
                item.name = name;
                item.price = price;
                if (req.file) {
                    const file = req.file;
                    const imageUrl = file.path;
                    item.image = imageUrl;
                }
                await item.save();
                res.status(200).json({
                    status: 200,
                    message: "Item updated successfully",
                    data: item,
                });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ status: 500, message: "Failed to update item" });
            }
        };
    }
}
exports.ItemController = ItemController;
;
