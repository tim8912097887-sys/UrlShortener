// Third party
import { CreateUserSchema } from "@/schemas/users/createUser.js";
import { LoginUserSchema } from "@/schemas/users/loginUser.js";
import { userSchemaChecker } from "@/shared/middlewares/userSchemaValidator.js";
import express from "express";

export const authRouter = express.Router();

authRouter.post("/login",userSchemaChecker(LoginUserSchema),);
authRouter.post("/signup",userSchemaChecker(CreateUserSchema),);
