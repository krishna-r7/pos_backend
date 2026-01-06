"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const router = express_1.default.Router();
const userController = new user_controller_1.UserController();
router.post("/create", userController.createUser);
router.post("/login", userController.loginUser);
router.get("/dashboard", userController.getDashboardData);
router.get("/cashiers", userController.getAllCashiers);
exports.default = router;
