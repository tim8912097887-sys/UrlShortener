import jwt from "jsonwebtoken"
import { logger } from "./logger.js";

type Payload = {
   sub: string
}

export const generateToken = (payload: Payload,secret: string,expiresIn: number) => {
    const token = jwt.sign(payload,secret,{
        algorithm: "HS256",
        expiresIn 
    });
    return token;
}

export const verifyToken = (token: string,secret: string,) => {
    try {
        const decode = jwt.verify(token,secret,{
            algorithms: ["HS256"]
        });
        return decode;   
    } catch (error: any) {
        logger.error("Token verification failed", { error: error.message });
        return null;
    }
}