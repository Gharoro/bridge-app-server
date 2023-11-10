import "reflect-metadata";
import express from "express";
import { InversifyExpressServer } from "inversify-express-utils";
import container from "./container";
import { AppDataSource } from "./db/data-source";
import logger from "./logger";
import configureSwagger from "./swagger/swagger-config";

(async () => {
  try {
    // Initialize the database connection
    await AppDataSource.initialize();

    let app: express.Application = express();

    const server: InversifyExpressServer = new InversifyExpressServer(
      container,
      null,
      {
        rootPath: "/api/v1",
      }
    );

    // Configure middlewares
    server.setConfig((app) => {
      app.use(express.json());
      configureSwagger(app);
    });

    const port: number = process.env.PORT
      ? parseInt(process.env.PORT, 10)
      : 5050;

    app = server.build();

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (err: any) {
    logger.error(`Error during initialization: ${err.message}`, {
      stack: err.stack,
    });
  }
})();
