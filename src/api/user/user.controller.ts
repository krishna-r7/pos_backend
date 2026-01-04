import { Request, Response } from "express";
import User , { UserRole } from "./user.model";     
import bcrypt from "bcrypt";   
import jwt from "jsonwebtoken";


export class UserController {

    createUser = async (req: Request, res: Response) => {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }

        if (!Object.values(UserRole).includes(role)) {
            res.status(400).json({ message: "Invalid role" });
            return;
        }
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400).json({ message: "User already exists" });
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
        res.status(200).json({ message: "User created successfully", user });
    };

    loginUser = async (req: Request, res: Response) => {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }
        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ message: "User does not exist" });
            return;
        }
        if (!user.isActive) {
            res.status(400).json({ message: "User is not active" });
            return;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(400).json({ message: "Invalid password" });
            return;
        }

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET as string, {
            expiresIn: "30d",
        });

        res.status(200).json({ message: "User logged in successfully", user, token });
    };

}