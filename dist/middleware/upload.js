"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
// Cloudinary storage
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.default,
    params: async (req, file) => ({
        folder: "pos/items", // folder in Cloudinary
        allowed_formats: ["jpg", "png", "jpeg", "webp"],
        public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
    }),
});
const upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
            cb(new Error("Only image files are allowed"));
            return;
        }
        cb(null, true);
    },
});
// console.log("upload:", upload);
exports.default = upload;
