import express from "express";
import cors from "cors";
require("dotenv").config();
import connectDB from "./db";
import routes from "../api/routes";
import { verifyToken } from "../middleware/authHeaders";

const port = process.env.PORT || 5000;
const app = express();

// Middleware configurations
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB
connectDB();

app.use(cors({
  origin: "*",
  methods: "GET, POST, PUT, DELETE, OPTIONS",
  allowedHeaders: "Content-Type, Authorization",
  credentials: true,
}));


app.use((req, res, next) => {
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

// Health check
app.get("/", (req, res) => {
  res.status(200).send({
    body: req.body,
    message: `${process.env.APP_NAME} is running`,
  });
});

app.use(verifyToken);
app.use("/api", routes);


export default app;