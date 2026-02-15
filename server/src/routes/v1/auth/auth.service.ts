import { LoginUserType } from "@schemas/users/loginUser.js";
import { UserModel } from "./auth.model.js";
import { ServerConflictError } from "@shared/error/serverConflict.js";
import { CreateUserType } from "@schemas/users/createUser.js";

const findUserByEmail = async (email: string) => {
     const user = await UserModel.findOne({email}).select("+password");   
     return user;
}

export const loginService = async (user: LoginUserType) => {
    const existUser = await findUserByEmail(user.email);
    if(!existUser) throw new ServerConflictError("Email or Password is incorrect");
    const isMatch = await existUser.comparePassword(user.password);
    if(!isMatch) throw new ServerConflictError("Email or Password is incorrect");
    return existUser;
}

export const signUpService = async (user: CreateUserType) => {
    const newUser = new UserModel(user);
    const savedUser = await newUser.save();
    return savedUser;
}