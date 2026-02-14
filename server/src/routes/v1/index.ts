import express from "express";
import { authRouter } from "./auth/auth.route.js";

export const v1Router = express.Router();

// Auth Route
v1Router.use("/auth",authRouter);