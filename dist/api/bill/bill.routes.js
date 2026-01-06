"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bill_controller_1 = require("./bill.controller");
const router = express_1.default.Router();
const billController = new bill_controller_1.BillController();
router.post("/add", billController.addItemToBill);
router.get("/current/:cashierId", billController.getCurrentBill);
router.put("/generate/:billId", billController.createBill);
router.post("/remove", billController.removeItemFromBill);
router.put("/update", billController.updateItemQuantity);
router.get("/history", billController.getHistory);
exports.default = router;
