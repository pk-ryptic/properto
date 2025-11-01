import { Router } from "express";
import { registerHandler } from "../controller/auth.controller";

const authRoutes = Router();

// prefix is `/auth`
authRoutes.post("/register", registerHandler);

export default authRoutes;