"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bill_routes_1 = __importDefault(require("./bill/bill.routes"));
const item_routes_1 = __importDefault(require("./item/item.routes"));
const user_routes_1 = __importDefault(require("./user/user.routes"));
const offer_routes_1 = __importDefault(require("./offer/offer.routes"));
const router = express_1.default.Router();
router.use("/bill", bill_routes_1.default);
router.use("/item", item_routes_1.default);
router.use("/user", user_routes_1.default);
router.use("/offer", offer_routes_1.default);
exports.default = router;
