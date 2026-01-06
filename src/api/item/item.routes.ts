import express from "express";
import { ItemController } from "./item.controller";
import upload from "../../middleware/upload";


const router = express.Router();
const itemController = new ItemController();


router.post("/add", upload.single("image"), itemController.addItem);
router.get("/all", itemController.getAllItems);
router.get("/active", itemController.getActiveItems);
router.post("/assignOffer", itemController.assignOffer);
router.put("/update/:itemId", upload.single("image"), itemController.updateItem);


export default router;