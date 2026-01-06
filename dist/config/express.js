"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv").config();
const db_1 = __importDefault(require("./db"));
const routes_1 = __importDefault(require("../api/routes"));
const authHeaders_1 = require("../middleware/authHeaders");
const port = process.env.PORT || 5000;
const app = (0, express_1.default)();
// Middleware configurations
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// DB
(0, db_1.default)();
app.use((0, cors_1.default)({
    origin: "*",
    methods: "GET, POST, PUT, DELETE, OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true,
}));
app.use((req, res, next) => {
    if (req.method === "OPTIONS")
        return res.sendStatus(200);
    next();
});
// Health check
app.get("/", (req, res) => {
    res.status(200).send({
        body: req.body,
        message: `${process.env.APP_NAME} is running`,
    });
});
app.use(authHeaders_1.verifyToken);
app.use("/api", routes_1.default);
exports.default = app;
