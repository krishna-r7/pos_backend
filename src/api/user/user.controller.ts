import { Request, Response } from "express";
import User, { UserRole } from "./user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Item from "../item/item.model";
import Bill from "../bill/bill.model";
import Offer from "../offer/offer.model";


export class UserController {

    createUser = async (req: Request, res: Response) => {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            res.status(400).json({ status: 400, message: "All fields are required" });
            return;
        }

        if (!Object.values(UserRole).includes(role)) {
            res.status(400).json({ status: 400, message: "Invalid role" });
            return;
        }
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400).json({ status: 400, message: "User already exists" });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role,
        });
        await user.save();
        res.status(200).json({ message: "User created successfully", status: 200, user });
    };

    loginUser = async (req: Request, res: Response) => {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ status: 400, message: "All fields are required" });
            return;
        }
        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ status: 400, message: "User does not exist" });
            return;
        }
        if (!user.isActive) {
            res.status(400).json({ status: 400, message: "User is not active" });
            return;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(400).json({ status: 400, message: "Invalid password" });
            return;
        }


        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET as string, {
            expiresIn: "30d",
        });

        res.status(200).json({ message: "User logged in successfully", status: 200, data: { user, token } });
    };

    getDashboardData = async (req: Request, res: Response) => {
        try {
            const totalCashUsers = await User.countDocuments({ role: UserRole.CASHIER });
            const totalItems = await Item.countDocuments();
            const totalActiveOffers = await Offer.countDocuments({ isActive: true });
            const totalCompletedBills = await Bill.countDocuments({ status: "COMPLETED" });

            res.status(200).json({
                message: "Dashboard data fetched successfully",
                data: {
                    totalCashUsers,
                    totalItems,
                    totalActiveOffers,
                    totalCompletedBills,
                },
            });
        } catch (error: unknown) {
            console.error(error);
            res.status(500).json({ message: "Failed to fetch dashboard data" });
        }
    };

    getAllCashiers = async (req: Request, res: Response) => {
        try {
            const cashiers = await User.find({ role: UserRole.CASHIER }).select("-password");
            res.status(200).json({
                message: "Cashier  fetched successfully",
                data: cashiers,
            });
        } catch (error: unknown) {
            console.error(error);
            res.status(500).json({ message: "Failed to fetch cashier " });
        }
    };

}