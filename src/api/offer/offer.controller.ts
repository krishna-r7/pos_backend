import { Request, Response } from "express";
import Offer , { OfferType } from "./offer.model";          

export class OfferController {
    addOffer = async (req: Request, res: Response) => {
        try {
            const { name, type , priority, discountPercent, minQty, discountAmount, isActive, validFrom, validTo } = req.body;
            if (!name || !type || !priority) {
                return res.status(400).json({ message: "Name, type and priority are required" });
            }

            if(type === OfferType.PERCENTAGE) {
                if(!discountPercent) {
                    return res.status(400).json({ message: "Discount percent is required for percentage offer" });
                }

                const offer = await Offer.create({ name, type, discountPercent, priority, isActive, validFrom, validTo });

                res.status(200).json({
                    message: "Offer created successfully",
                    data: offer,
                });

            } else if(type === OfferType.QUANTITY) {
                if(!minQty || !discountAmount) {
                    return res.status(400).json({ message: "Min qty and discount amount are required for quantity offer" });
                }

                const offer = await Offer.create({ name, type, minQty, discountAmount, priority, isActive, validFrom, validTo });

                res.status(200).json({
                    message: "Offer created successfully",
                    data: offer,
                });
            }

        } catch (error: unknown) {
            console.error(error);
            res.status(500).json({ message: "Failed to create offer" });
        }
    }
}
