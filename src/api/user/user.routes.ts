import express from "express";
import { UserController } from "./user.controller";

const router = express.Router();
const userController = new UserController();

router.post("/create", userController.createUser);    
router.post("/login", userController.loginUser);
router.get("/dashboard", userController.getDashboardData);
router.get("/cashiers", userController.getAllCashiers);



export default router;