// models/Offer.ts
import { Schema, model } from "mongoose";

export enum OfferType {
  PERCENTAGE = "PERCENTAGE",
  QUANTITY = "QUANTITY",
}

const OfferSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: Object.values(OfferType),
      required: true,
    },

    // Percentage Discount
    discountPercent: Number,

    // Quantity Wise Discount
    minQty: Number,
    discountAmount: Number,

    priority: {
      type: Number,
      required: true, // lower number = higher priority
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    validFrom: Date,
    validTo: Date,
  },
  { timestamps: true }
);

export default model("Offer", OfferSchema);
