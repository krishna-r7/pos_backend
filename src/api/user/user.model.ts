import { Schema, model } from "mongoose";

export enum UserRole {
  ADMIN = "ADMIN",
  CASHIER = "CASHIER",
}

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true, // hashed
    },

    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.CASHIER,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default model("User", UserSchema);
