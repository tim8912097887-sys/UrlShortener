// Third party
import { CreateUserSchema } from "@schemas/users/createUser.js";
import { LoginUserSchema } from "@schemas/users/loginUser.js";
import { userSchemaChecker } from "@/shared/middlewares/userSchemaValidator.js";
import express from "express";
import { loginUserController, logoutUserController, refreshTokenController, signupUserController } from "./auth.controller.js";

export const authRouter = express.Router();

authRouter.post("/login",userSchemaChecker(LoginUserSchema),loginUserController);
authRouter.post("/signup",userSchemaChecker(CreateUserSchema),signupUserController);
authRouter.delete("/logout",logoutUserController);
authRouter.get("/refresh-token",refreshTokenController);