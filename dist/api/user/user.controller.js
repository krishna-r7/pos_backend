"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_model_1 = __importStar(require("./user.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const item_model_1 = __importDefault(require("../item/item.model"));
const bill_model_1 = __importDefault(require("../bill/bill.model"));
const offer_model_1 = __importDefault(require("../offer/offer.model"));
class UserController {
    constructor() {
        this.createUser = async (req, res) => {
            const { name, email, password, role } = req.body;
            if (!name || !email || !password || !role) {
                res.status(400).json({ status: 400, message: "All fields are required" });
                return;
            }
            if (!Object.values(user_model_1.UserRole).includes(role)) {
                res.status(400).json({ status: 400, message: "Invalid role" });
                return;
            }
            const userExists = await user_model_1.default.findOne({ email });
            if (userExists) {
                res.status(400).json({ status: 400, message: "User already exists" });
                return;
            }
            const hashedPassword = await bcrypt_1.default.hash(password, 10);
            const user = new user_model_1.default({
                name,
                email,
                password: hashedPassword,
                role,
            });
            await user.save();
            res.status(200).json({ message: "User created successfully", status: 200, user });
        };
        this.loginUser = async (req, res) => {
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(400).json({ status: 400, message: "All fields are required" });
                return;
            }
            const user = await user_model_1.default.findOne({ email });
            if (!user) {
                res.status(400).json({ status: 400, message: "User does not exist" });
                return;
            }
            if (!user.isActive) {
                res.status(400).json({ status: 400, message: "User is not active" });
                return;
            }
            const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                res.status(400).json({ status: 400, message: "Invalid password" });
                return;
            }
            const token = jsonwebtoken_1.default.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
                expiresIn: "30d",
            });
            res.status(200).json({ message: "User logged in successfully", status: 200, data: { user, token } });
        };
        this.getDashboardData = async (req, res) => {
            try {
                const totalCashUsers = await user_model_1.default.countDocuments({ role: user_model_1.UserRole.CASHIER });
                const totalItems = await item_model_1.default.countDocuments();
                const totalActiveOffers = await offer_model_1.default.countDocuments({ isActive: true });
                const totalCompletedBills = await bill_model_1.default.countDocuments({ status: "COMPLETED" });
                res.status(200).json({
                    message: "Dashboard data fetched successfully",
                    data: {
                        totalCashUsers,
                        totalItems,
                        totalActiveOffers,
                        totalCompletedBills,
                    },
                });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: "Failed to fetch dashboard data" });
            }
        };
        this.getAllCashiers = async (req, res) => {
            try {
                const cashiers = await user_model_1.default.find({ role: user_model_1.UserRole.CASHIER }).select("-password");
                res.status(200).json({
                    message: "Cashier  fetched successfully",
                    data: cashiers,
                });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: "Failed to fetch cashier " });
            }
        };
    }
}
exports.UserController = UserController;
