import swaggerUi from "swagger-ui-express";
import swaggerSpec from "../swagger/swagger-config";

const setupSwagger = (app: any) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default setupSwagger;
