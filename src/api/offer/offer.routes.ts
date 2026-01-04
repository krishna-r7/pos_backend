import express from "express";
import { OfferController } from "./offer.controller";

const router = express.Router();
const offerController = new OfferController();

router.post("/add", offerController.addOffer);

export default router;