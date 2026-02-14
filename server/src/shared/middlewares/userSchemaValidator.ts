import { ZodObject } from "zod";
import { RequestHandler } from "express";
import { BadRequestError } from "@shared/error/badRequest.js";
import { CreateUserType } from "@/schemas/users/createUser.js";
import { LoginUserType } from "@/schemas/users/loginUser.js";
import { asyncHandler } from "@/utilities/asyncHandler.js";

export const userSchemaChecker = (schema: ZodObject): RequestHandler => asyncHandler((req,_res,next) => {
      const result = schema.safeParse(req.body);
      if(!result.success) throw new BadRequestError(result.error.issues[0].message);
      // Attach validated data
      req.user = result.data as (CreateUserType | LoginUserType);
      return next();
})