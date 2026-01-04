import express from "express";
import billRouter from "./bill/bill.routes";
import itemRouter from "./item/item.routes";
import userRouter from "./user/user.routes";
import offerRouter from "./offer/offer.routes";

const router = express.Router();

router.use("/bill", billRouter);
router.use("/item", itemRouter);
router.use("/user", userRouter);
router.use("/offer", offerRouter);


export default router;