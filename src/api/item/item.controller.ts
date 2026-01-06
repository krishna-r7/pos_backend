
import { Request, Response } from "express";
import Item from "./item.model";
import Offer from "../offer/offer.model";

export class ItemController {

    addItem = async (req: Request, res: Response) => {
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
                } catch {
                  offerId = offerId.split(",");
                }
              }

            const offerIds: string[] = Array.isArray(offerId)
                ? offerId
                : offerId
                    ? [offerId]
                    : [];
            const offers = await Offer.find({ _id: { $in: offerIds } });

            if (offers.length !== offerIds.length) {
                return res.status(404).json({ status: 404, message: "One or more offers not found" });
            }
            
            const item = await Item.create({ name, price });
             console.log("FILE:", req.file);

            if(req.file){
                const file = req.file as any;
                const imageUrl = file.path;  
                item.image = imageUrl;
            }

            await item.save();

            const updatedItem = await Item.findByIdAndUpdate(
                item._id,
                { $addToSet: { offers: offerId } },
                { new: true }
            ).populate("offers");

            
            res.status(200).json({
                message: "Item created successfully",
                data: updatedItem,
                status:200
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
                return res.status(400).json({ status: 400, message: "Item ID and Offer ID are required" });
            }
            const item = await Item.findById(itemId);
            if (!item) {
                return res.status(404).json({ status: 404, message: "Item not found" });
            }
            const offer = await Offer.findById(offerId);
            if (!offer) {
                return res.status(404).json({ status: 404, message: "Offer not found" });
            }

            const updatedItem = await Item.findByIdAndUpdate(
                itemId,
                { $addToSet: { offers: offerId } },
                { new: true }
            ).populate("offers");

            res.status(200).json({
                message: "Offer assigned successfully",
                status: 200,
                data: updatedItem,
            });
        } catch (error: unknown) {
            console.error(error);
            res.status(500).json({ message: "Failed to assign offer" });
        }
    };

    getAllItems = async (req: Request, res: Response) => {
        try {
            let { page = 1, limit = 10 , search = "" } = req.query;
            page = Number(page);
            limit = Number(limit);
            
            let filter: Record<string, any> = {};

            if(search){
                
                if (typeof search === "string") {
                    const trimmedSearch = search.trim();
                    filter = {
                        ...filter,
                        name: { $regex: trimmedSearch, $options: "i" },
                    }   
                }
            }
            
            const items = await Item.find(filter).populate("offers").skip((page - 1) * limit).limit(limit);
            const totalItems = await Item.countDocuments(filter);
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
        } catch (error: unknown) {
            console.error(error);
            res.status(500).json({ status: 500, message: "Failed to fetch items" });
        }
    };

    getActiveItems = async (req: Request, res: Response) => {
        try {
            let { page = 1, limit = 10, search = "" } = req.query;
            page = Number(page);
            limit = Number(limit);

          let filter: Record<string, any> = { isActive: true };

            if(search){
                
                if (typeof search === "string") {
                    const trimmedSearch = search.trim();
                    filter = {
                        ...filter,
                        name: { $regex: trimmedSearch, $options: "i" },
                    }   
                }
            }
            
            const items = await Item.find(filter).populate("offers").skip((page - 1) * limit).limit(limit);
            const totalItems = await Item.countDocuments(filter);
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

    updateItem = async (req: Request, res: Response) => {
        try {

            const itemId = req.params.itemId;

            const { name, price } = req.body;
            if (!itemId || !name || !price) {
                return res.status(400).json({ status: 400, message: "Item ID, name, and  price are required" });
            }
            const item = await Item.findById(itemId);
            if (!item) {
                return res.status(404).json({ status: 404, message: "Item not found" });
            }

           item.name = name;
           item.price = price;

           if(req.file){
                const file = req.file as any;
                const imageUrl = file.path;  
                item.image = imageUrl;
            }


           await item.save();

            res.status(200).json({
                status: 200,
                message: "Item updated successfully",
                data: item,
            });


        } catch (error: unknown) {
            console.error(error);
            res.status(500).json({ status: 500, message: "Failed to update item" });
        }
    }

};

