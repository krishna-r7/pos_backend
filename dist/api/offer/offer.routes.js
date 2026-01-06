"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const offer_controller_1 = require("./offer.controller");
const router = express_1.default.Router();
const offerController = new offer_controller_1.OfferController();
router.post("/add", offerController.addOffer);
router.get("/active", offerController.getActiveOffers);
router.get("/all", offerController.getAllOffers);
router.put("/status/:id", offerController.updateStatus);
exports.default = router;
