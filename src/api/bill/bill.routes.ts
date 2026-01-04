import express from "express";
import { BillController } from "./bill.controller";

const router = express.Router();
const billController = new BillController();


router.post("/add", billController.addItemToBill);
router.get("/current/:cashierId", billController.getCurrentBill);
router.put("/generate/:billId", billController.createBill);
router.post("/remove", billController.removeItemFromBill);
router.put("/update", billController.updateItemQuantity);
router.get("/history", billController.getHistory);



export default router;