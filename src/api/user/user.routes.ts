import express from "express";
import { UserController } from "./user.controller";

const router = express.Router();
const userController = new UserController();

router.post("/create", userController.createUser);    
router.post("/login", userController.loginUser);

export default router;