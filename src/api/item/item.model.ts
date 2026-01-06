
import { Schema, model, Types } from "mongoose";

const ItemSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      // required: true,
    },

    offers: [
      {
        type: Types.ObjectId,
        ref: "Offer",
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    
    image:String,
  },
  { timestamps: true }
);

export default model("Item", ItemSchema);
