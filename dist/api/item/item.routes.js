"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const item_controller_1 = require("./item.controller");
const upload_1 = __importDefault(require("../../middleware/upload"));
const router = express_1.default.Router();
const itemController = new item_controller_1.ItemController();
router.post("/add", upload_1.default.single("image"), itemController.addItem);
router.get("/all", itemController.getAllItems);
router.get("/active", itemController.getActiveItems);
router.post("/assignOffer", itemController.assignOffer);
router.put("/update/:itemId", upload_1.default.single("image"), itemController.updateItem);
exports.default = router;
