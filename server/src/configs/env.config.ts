import { logger } from "@/utilities/logger.js";
import z from "zod";

const NODE_Type = ["development","production","test"] as const;

const envSchema = z.object({
    PORT: z.string("Port must be a string").regex(/^[0-9]+$/).transform((val) => parseInt(val,10)).refine((val) => !isNaN(val) && val > 0 && val < 65536, {
        message: "Port must be a valid number between 1 and 65535"
    }),
    MONGO_URI: z.string("Mongo URI must be a string").nonempty("Mongo URI can't be empty"),
    NODE_ENV: z.enum(NODE_Type,`NODE_ENV must be development,production or test`),
    SALT_ROUNDS: z.string("Salt rounds must be a string").regex(/^[0-9]+$/).transform((val) => parseInt(val,10)).refine((val) => !isNaN(val) && val > 0 && val < 100, {
        message: "Salt rounds must be a valid positive number less than 100"
    }),
    // REFRESH_TOKEN_SECRET: z.string("Secret must be a string").nonempty("Secret can't be empty"),
    // ACCESS_TOKEN_SECRET: z.string("Secret must be a string").nonempty("Secret can't be empty"),
    // REFRESH_TOKEN_EXPIRED: z.string("Expired Time must be a string").nonempty("Expired Time can't be empty"),
    // ACCESS_TOKEN_EXPIRED: z.string("Expired Time must be a string").nonempty("Expired Time can't be empty"),
    // ATTEMPT_TIME: z.string("Attempt Time must be a string").nonempty("Attempt Time can't be empty"),
    // ACCOUNT_LOCK_TIME: z.string("Account Lock Time must be a string").nonempty("Account Lock Time can't be empty"),
    // REDIS_HOST: z.string("Redis host must be a string").nonempty("Redis host can't be empty"),
    // REDIS_PORT: z.string("Redis port must be a string").nonempty("Redis port can't be empty"),
    // REDIS_PASSWORD: z.string("Redis password must be a string").nonempty("Redis password can't be empty"),
    // LOGIN_WINDOW_FRAME: z.string("Login window frame must be a string").nonempty("Login window frame can't be empty"),
    // LOGIN_WINDOW_TIMES: z.string("Login window times must be a string").nonempty("Login window times can't be empty")
})

const result = envSchema.safeParse(process.env);
// Throw error if env missing
if(!result.success) {
    logger.error(`Environment variable validation failed: ${result.error.issues.map(issue => `${issue.path.join('.')} - ${issue.message}`).join('\n')}`);
    throw new Error("Environment variable validation failed");
} 
// Get type after safe parse
export const env = result.data;