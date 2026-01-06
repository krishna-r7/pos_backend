import { Request, Response } from "express";
import Offer , { OfferType } from "./offer.model";          

export class OfferController {
    addOffer = async (req: Request, res: Response) => {
        try {
            const { name, type , priority, discountPercent, minQty, discountAmount, isActive, validFrom, validTo } = req.body;
            if (!name || !type || !priority) {
                return res.status(400).json({ status: 400, message: "Name, type and priority are required" });
            }

            if(type === OfferType.PERCENTAGE) {
                if(!discountPercent) {
                    return res.status(400).json({ status: 400, message: "Discount percent is required for percentage offer" });
                }

                const offer = await Offer.create({ name, type, discountPercent, priority, isActive, validFrom, validTo });

                res.status(200).json({
                    message: "Offer created successfully",
                    data: offer,
                    status :200,
                });

            } else if(type === OfferType.QUANTITY) {
                if(!minQty || !discountAmount) {
                    return res.status(400).json({ status: 400, message: "Min qty and discount amount are required for quantity offer" });
                }

                const offer = await Offer.create({ name, type, minQty, discountAmount, priority, isActive, validFrom, validTo });

                res.status(200).json({
                    message: "Offer created successfully",
                    status :200,
                    data: offer,
                });
            }

        } catch (error: unknown) {
            console.error(error);
            res.status(500).json({ message: "Failed to create offer" });
        }
    };
    
    getActiveOffers = async (req: Request, res: Response) => {
        try {
            let {page = 1, limit = 10,search = ""} = req.query;
            page = Number(page);
            limit = Number(limit);

            let filter: any = { isActive: true };
            if(search) {
                filter.name = { $regex: search, $options: "i" };
            }

            const offers = await Offer.find(filter).sort({ priority: -1 }).select("name  priority").skip((page - 1) * limit).limit(limit);

            const total = await Offer.countDocuments(filter);
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
        } catch (error: unknown) {
            console.error(error);
            res.status(500).json({ message: "Failed to fetch active offers" });
        }
    };

    getAllOffers = async (req: Request, res: Response) => {
        try {

            let {page = 1, limit = 10,search = ""} = req.query;
            page = Number(page);
            limit = Number(limit);

            let filter: any = { };
            if(search) {
                filter.name = { $regex: search, $options: "i" };
            }

            const offers = await Offer.find(filter).sort({ priority: -1 }).skip((page - 1) * limit).limit(limit);
            const total = await Offer.countDocuments(filter);
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
        } catch (error: unknown) {
            console.error(error);
            res.status(500).json({ message: "Failed to fetch all offers" });
        }
    };


    updateStatus = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            if (!id ) {
                return res.status(400).json({ status: 400, message: "ID is required" });
            }

            const offer = await Offer.findById(id);
            if (!offer) {
                return res.status(404).json({ status: 404, message: "Offer not found" });
            }

            offer.isActive = !offer.isActive;
            await offer.save();

            res.status(200).json({
                message: "Offer status updated successfully",
                status :200,
                data: offer,
            });
        } catch (error: unknown) {
            console.error(error);
            res.status(500).json({ message: "Failed to update offer status" });
        }
    };


}
