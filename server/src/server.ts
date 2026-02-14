import { app } from "@/app.js";
import { gracefulShutdown } from "@utilities/shutdown.js";
import { env } from "@configs/env.config.js";
import { logger } from "@utilities/logger.js";
import { dbConnection } from "./db/db.js";

(async () => {
    try {
      const server = app.listen(env.PORT, () => {
        logger.info(`Server is running on port ${env.PORT}`);
      });

      await dbConnection();
      const shutdownHandler = gracefulShutdown({ server });
    // Handle termination signals and unexpected errors
    process.on('SIGINT', shutdownHandler);
    process.on('SIGTERM', shutdownHandler);
    process.on('uncaughtException', (err) => {
      logger.error('Uncaught Exception:', err);
      shutdownHandler('uncaughtException');
    });
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
      shutdownHandler('unhandledRejection');
    });
    } catch (error: any) {
      logger.error(`Server initialization failed: ${error.message}`);
      process.exit(1);
    }
  
})();