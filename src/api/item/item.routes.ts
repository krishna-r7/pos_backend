import express from "express";
import { ItemController } from "./item.controller";

const router = express.Router();
const itemController = new ItemController();


router.post("/add", itemController.addItem);
router.get("/all", itemController.getAllItems);
router.get("/active", itemController.getActiveItems);
router.post("/assignOffer", itemController.assignOffer);

export default router;