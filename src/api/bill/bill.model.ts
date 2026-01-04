
import { Schema, model, Types } from "mongoose";
import { BillItemSchema } from "./itembill.model";

export enum BillStatus {
  OPEN = "OPEN",
  COMPLETED = "COMPLETED",
}


const BillSchema = new Schema(
  {
    cashierId: {
      type: Types.ObjectId,
      ref: "User",
    },

    status: {
      type: String,
      enum: BillStatus,
      default: BillStatus.OPEN,
    },

    items: [BillItemSchema],

    subTotal: {
      type: Number,
      required: true,
      default: 0,
    },

    totalDiscount: {
      type: Number,
      required: true,
      default: 0,
    },

    finalPayableAmount: {
      type: Number,
      required: true,
      default: 0,
    },

    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

BillSchema.index({ cashierId: 1, status: 1 });

export default model("Bill", BillSchema);
