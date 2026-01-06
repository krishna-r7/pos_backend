import express from "express";
import { OfferController } from "./offer.controller";

const router = express.Router();
const offerController = new OfferController();

router.post("/add", offerController.addOffer);
router.get("/active", offerController.getActiveOffers);
router.get("/all", offerController.getAllOffers);
router.put("/status/:id", offerController.updateStatus);


export default router;