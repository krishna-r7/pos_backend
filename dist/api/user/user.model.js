"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRole = void 0;
const mongoose_1 = require("mongoose");
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "ADMIN";
    UserRole["CASHIER"] = "CASHIER";
})(UserRole || (exports.UserRole = UserRole = {}));
const UserSchema = new mongoose_1.Schema({
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
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("User", UserSchema);
