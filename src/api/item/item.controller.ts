
import { Request, Response } from "express";
import Item from "./item.model";
import Offer from "../offer/offer.model";

export class ItemController {

    addItem = async (req: Request, res: Response) => {
        try {
            const { name, price } = req.body;
            if (!name || !price) {
                return res.status(400).json({ message: "Name and price are required" });
            }
            const item = await Item.create({ name, price });

            res.status(201).json({
                message: "Item created successfully",
                data: item,
            });
        } catch (error: unknown) {
            console.error(error);
            res.status(500).json({ message: "Failed to create item" });
        }
    };

    assignOffer = async (req: Request, res: Response) => {
        try {
            const { itemId, offerId } = req.body;
            if (!itemId || !offerId) {
                return res.status(400).json({ message: "Item ID and Offer ID are required" });
            }
            const item = await Item.findById(itemId);
            if (!item) {
                return res.status(404).json({ message: "Item not found" });
            }
            const offer = await Offer.findById(offerId);
            if (!offer) {
                return res.status(404).json({ message: "Offer not found" });
            }

            const updatedItem = await Item.findByIdAndUpdate(
                itemId,
                { $addToSet: { offers: offerId } },
                { new: true }
            ).populate("offers");

            res.status(200).json({
                message: "Offer assigned successfully",
                data: updatedItem,
            });
        } catch (error: unknown) {
            console.error(error);
            res.status(500).json({ message: "Failed to assign offer" });
        }
    };

    getAllItems = async (req: Request, res: Response) => {
        try {
            let { page = 1, limit = 10 } = req.query;
            page = Number(page);
            limit = Number(limit);
            const items = await Item.find().populate("offers").skip((page - 1) * limit).limit(limit);
            const totalItems = await Item.countDocuments();
            const totalPages = Math.ceil(totalItems / limit);

            res.status(200).json({
                message: "Items fetched successfully",
                data: items,
                pagination: {
                    page,
                    limit,
                    totalItems,
                    totalPages,
                },
            });
        } catch (error: unknown) {
            console.error(error);
            res.status(500).json({ message: "Failed to fetch items" });
        }
    };

    getActiveItems = async (req: Request, res: Response) => {
        try {
            let { page = 1, limit = 10 } = req.query;
            page = Number(page);
            limit = Number(limit);
            const items = await Item.find({isActive: true}).populate("offers").skip((page - 1) * limit).limit(limit);
            const totalItems = await Item.countDocuments({isActive: true});
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
        } catch (error: unknown) {
            console.error(error);
            res.status(500).json({ message: "Failed to fetch active items" });
        }
    };

};

