import { BadRequestError } from "@shared/error/badRequest.js";
import { asyncHandler } from "@utilities/asyncHandler.js";
import { loginService, signUpService } from "./auth.service.js";
import { responseEnvelope } from "@utilities/responseEnvelope.js";
import { env } from "@configs/env.config.js";
import { generateToken, verifyToken } from "@utilities/token.js";
import { cookieOptions } from "@/utilities/cookie.js";
import { UnauthorizedError } from "@/shared/error/unauthorized.js";

export const loginUserController = asyncHandler(async (req,res) => {
    
    if(!req.user) throw new BadRequestError("Invalid Credentials");
    const user =await loginService(req.user);
    const payload = {
        sub: user._id.toString()
    };
    // Token
    const accessToken = generateToken(payload,env.ACCESS_TOKEN_SECRET,env.ACCESS_TOKEN_EXPIRES_IN);
    const refreshToken = generateToken(payload,env.REFRESH_TOKEN_SECRET,env.REFRESH_TOKEN_EXPIRES_IN);
    
    const responseObject = {
        state: "success" as const,
        data: {
            user,
            accessToken
        }
    }

    res.cookie("refreshToken",refreshToken,cookieOptions(env.REFRESH_TOKEN_EXPIRES_IN*1000,"/api/v1/auth"));
    res.status(200).json(responseEnvelope(responseObject));
})

export const signupUserController = asyncHandler(async (req,res) => {
    
    if(!req.user) throw new BadRequestError("Invalid Credentials");
    const user = await signUpService(req.user);
    const responseObject = {
        state: "success" as const,
        data: {
            user
        }
    }
    res.status(201).json(responseEnvelope(responseObject));
    
    
})

export const logoutUserController = asyncHandler(async (_req,res) => {
    
    res.clearCookie("refreshToken",cookieOptions(env.REFRESH_TOKEN_EXPIRES_IN*1000,"/api/v1/auth"));
    const responseObject = {
        state: "success" as const,
    }
    res.status(201).json(responseEnvelope(responseObject));
    
    
})

export const refreshTokenController = asyncHandler(async (req,res) => {
    
    const refreshToken = req.cookies.refreshToken;
    console.log("Received refresh token:", refreshToken);
    if(!refreshToken) throw new UnauthorizedError("Unauthenticated");
    const decoded = verifyToken(refreshToken,env.REFRESH_TOKEN_SECRET);
    if(!decoded || typeof decoded === "string") throw new UnauthorizedError("Unauthenticated");
    const payload = {
        sub: decoded.sub as string
    };
    // Token
    const accessToken = generateToken(payload,env.ACCESS_TOKEN_SECRET,env.ACCESS_TOKEN_EXPIRES_IN);
    const newRefreshToken = generateToken(payload,env.REFRESH_TOKEN_SECRET,env.REFRESH_TOKEN_EXPIRES_IN);
    const responseObject = {
        state: "success" as const,
        data: {
            accessToken
        }
    }
    // Refresh token rotation
    res.cookie("refreshToken",newRefreshToken,cookieOptions(env.REFRESH_TOKEN_EXPIRES_IN*1000,"/api/v1/auth"));
    res.status(200).json(responseEnvelope(responseObject));
    
})

