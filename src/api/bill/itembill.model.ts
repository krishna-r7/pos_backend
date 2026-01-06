import { Schema, model, Types } from "mongoose";

export const BillItemSchema = new Schema({

  itemId: {
    type: Types.ObjectId,
    ref: "Item",
    required: true,
  },

  itemName: String,
  unitPrice: Number,

  quantity: {
    type: Number,
    required: true,
  },

  availableOffer: {
    offerId: {
      type: Types.ObjectId,
      ref: "Offer",
    },
    offerName: String,
    
    discountAmount: {
      type: Number,
      default: 0,
    },
    freeQty: {
      type: Number,
      default: 0,
    },

    isApplied: {
      type: Boolean,
      default: false,
    }
    
  },

  finalItemTotal: {
    type: Number,
    required: true,
  },

  deletedAt: {
    type: Date,
    default: null,
  },
  
});


