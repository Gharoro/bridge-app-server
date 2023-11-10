import * as express from "express";
import swaggerJsdoc from "swagger-jsdoc";
import * as swaggerUi from "swagger-ui-express";
import UserController from "../controllers/user.controller";
import HouseController from "../controllers/house.controller";

const configureSwagger = (app: express.Application) => {
  const controllers = [UserController, HouseController];

  const options: swaggerJsdoc.Options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Your API Title",
        version: "1.0.0",
      },
      servers: [
        {
          url: "/api/v1",
        },
      ],
      components: {
        securitySchemes: {
          BearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
        schemas: {
          User: {
            type: "object",
            properties: {
              id: { type: "number" },
              first_name: { type: "string" },
              last_name: { type: "string" },
              email: { type: "string" },
              password: { type: "string" },
              profile_picture: { type: "string" },
              role: { type: "string" },
              email_confirmed: { type: "boolean" },
              houses: { type: "array" },
              bids: { type: "array" },
              counter_bids: { type: "array" },
              created_at: { type: "string" },
              updated_at: { type: "string" },
            },
          },
          House: {
            type: "object",
            properties: {
              id: { type: "number" },
              user: { type: "object" },
              title: { type: "string" },
              description: { type: "string" },
              location: { type: "string" },
              price: { type: "number" },
              number_of_rooms: { type: "number" },
              amenities: { type: "array" },
              media: { type: "array" },
              bids: { type: "array" },
              created_at: { type: "string" },
              updated_at: { type: "string" },
            },
          },
          Bid: {
            type: "object",
            properties: {
              id: { type: "number" },
              sender: { type: "object" },
              house: { type: "object" },
              counter_bids: { type: "array" },
              status: { type: "string" },
              description: { type: "string" },
              price: { type: "number" },
              transaction: { type: "object" },
              created_at: { type: "string" },
              updated_at: { type: "string" },
            },
          },
          Transaction: {
            type: "object",
            properties: {
              id: { type: "number" },
              bid: { type: "object" },
              status: { type: "string" },
              transaction_ref: { type: "string" },
              price: { type: "number" },
              created_at: { type: "string" },
              updated_at: { type: "string" },
            },
          },
          SignupRequest: {
            type: "object",
            properties: {
              first_name: { type: "string" },
              last_name: { type: "string" },
              email: { type: "string" },
              password: { type: "string" },
              profile_picture: { type: "string" },
              role: { type: "string" },
            },
          },
          ConfirmEmailRequest: {
            type: "object",
            properties: {
              signup_token: { type: "string" },
            },
          },
          LoginRequest: {
            type: "object",
            properties: {
              email: { type: "string" },
              password: { type: "string" },
            },
          },
          CreateHouseRequest: {
            type: "object",
            properties: {
              title: { type: "string" },
              description: { type: "string" },
              location: { type: "string" },
              price: { type: "number" },
              number_of_rooms: { type: "number" },
              amenities: { type: "array" },
              media: { type: "array" },
            },
          },
          FetchHouseRequest: {
            type: "object",
            properties: {
              id: { type: "integer" },
            },
            required: ["id"],
          },
          CreateBidRequest: {
            type: "object",
            properties: {
              house: { type: "integer" },
              description: { type: "string" },
              price: { type: "number" },
            },
          },
          CreateCounterBidRequest: {
            type: "object",
            properties: {
              bid: { type: "integer" },
              description: { type: "string" },
              price: { type: "number" },
            },
          },
          UpdateBidRequest: {
            type: "object",
            properties: {
              status: { type: "string" },
            },
          },
          VerifyPaymentRequest: {
            type: "object",
            properties: {
              transaction_ref: { type: "string" },
              bid_id: { type: "number" },
            },
          },
          LoginResponse: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              message: { type: "string" },
              data: {
                type: "object",
                properties: {
                  token: { type: "string" },
                },
              },
            },
          },
          ConfirmEmailSuccess: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              message: { type: "string" },
            },
          },
          SignupSuccess: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              message: { type: "string" },
            },
          },
          FetchAllHouseSuccess: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              message: { type: "string" },
              data: {
                type: "array",
                items: { $ref: "#/components/schemas/House" },
              },
            },
          },
          FetchSingleHouseSuccess: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              message: { type: "string" },
              data: { $ref: "#/components/schemas/House" },
            },
          },
          FetchAllBidSuccess: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              message: { type: "string" },
              data: {
                type: "array",
                items: { $ref: "#/components/schemas/Bid" },
              },
            },
          },
          FetchTransactionsSuccess: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              message: { type: "string" },
              data: {
                type: "array",
                items: { $ref: "#/components/schemas/Transaction" },
              },
            },
          },
          ErrorResponse: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              error: { type: "string" },
            },
          },
          SuccessResponse: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              message: { type: "string" },
            },
          },
        },
      },
      paths: {
        "/user": {
          post: {
            tags: ["User"],
            summary: "Signup user",
            requestBody: {
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/SignupRequest" },
                },
              },
            },
            responses: {
              "201": {
                description:
                  "Account created successfully. Please confirm your email.",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/SignupSuccess" },
                  },
                },
              },
              "400": {
                description: "Bad Request",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/ErrorResponse" },
                  },
                },
              },
              "500": {
                description: "Internal Server Error",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/ErrorResponse" },
                  },
                },
              },
            },
          },
        },
        "/user/confirm_email": {
          put: {
            tags: ["User"],
            summary: "Confirm user email",
            requestBody: {
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ConfirmEmailRequest" },
                },
              },
            },
            responses: {
              "200": {
                description: "Email confirmed successfully.",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ConfirmEmailSuccess",
                    },
                  },
                },
              },
              "400": {
                description: "Bad Request",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/ErrorResponse" },
                  },
                },
              },
              "404": {
                description: "User not found",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/ErrorResponse" },
                  },
                },
              },
              "500": {
                description: "Internal Server Error",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/ErrorResponse" },
                  },
                },
              },
            },
          },
        },
        "/user/login": {
          post: {
            tags: ["User"],
            summary: "Login user",
            requestBody: {
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/LoginRequest" },
                },
              },
            },
            responses: {
              "200": {
                description: "Login successful",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/LoginResponse" },
                  },
                },
              },
              "400": {
                description: "Bad Request",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/ErrorResponse" },
                  },
                },
              },
              "401": {
                description: "Invalid credentials",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/ErrorResponse" },
                  },
                },
              },
              "500": {
                description: "Internal Server Error",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/ErrorResponse" },
                  },
                },
              },
            },
          },
        },
        "/house": {
          get: {
            tags: ["House"],
            summary: "Get all houses",
            responses: {
              "200": {
                description: "Successful response",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/FetchAllHouseSuccess",
                    },
                  },
                },
              },
              "500": {
                description: "Internal Server Error",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/ErrorResponse" },
                  },
                },
              },
            },
          },
          post: {
            tags: ["House"],
            summary: "Create a new house",
            security: [{ BearerAuth: [] }],
            requestBody: {
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/CreateHouseRequest" },
                },
              },
            },
            responses: {
              "201": {
                description: "House created successfully",
              },
              "400": {
                description: "Bad Request",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/ErrorResponse" },
                  },
                },
              },
              "500": {
                description: "Internal Server Error",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/ErrorResponse" },
                  },
                },
              },
            },
          },
        },
        "/house/{id}": {
          get: {
            tags: ["House"],
            summary: "Get a single house by ID",
            parameters: [
              {
                in: "path",
                name: "id",
                description: "ID of the house to retrieve",
                required: true,
                schema: {
                  type: "integer",
                },
              },
            ],
            responses: {
              "200": {
                description: "Successful response",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/FetchSingleHouseSuccess",
                    },
                  },
                },
              },
              "404": {
                description: "House not found",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/ErrorResponse" },
                  },
                },
              },
              "500": {
                description: "Internal Server Error",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/ErrorResponse" },
                  },
                },
              },
            },
          },
        },
        "/bid/{id}": {
          get: {
            tags: ["Bid"],
            summary: "Get bids for a house",
            security: [{ BearerAuth: [] }],
            parameters: [
              {
                in: "path",
                name: "id",
                description: "ID of the house to retrieve bids for",
                required: true,
                schema: {
                  type: "integer",
                },
              },
            ],
            responses: {
              "200": {
                description: "Successful response",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/FetchAllBidSuccess",
                    },
                  },
                },
              },
              "500": {
                description: "Internal Server Error",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/ErrorResponse" },
                  },
                },
              },
            },
          },
        },
        "/bid": {
          post: {
            tags: ["Bid"],
            summary: "Make a bid",
            security: [{ BearerAuth: [] }],
            requestBody: {
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/CreateBidRequest" },
                },
              },
            },
            responses: {
              "200": {
                description: "Bid successfully sent",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/SuccessResponse" },
                  },
                },
              },
              "400": {
                description: "Bad Request",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/ErrorResponse" },
                  },
                },
              },
              "404": {
                description: "User or House not found",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/ErrorResponse" },
                  },
                },
              },
              "500": {
                description: "Internal Server Error",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/ErrorResponse" },
                  },
                },
              },
            },
          },
        },
        "/bid/counter": {
          post: {
            tags: ["Bid"],
            summary: "Counter a bid",
            security: [{ BearerAuth: [] }],
            requestBody: {
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/CreateCounterBidRequest",
                  },
                },
              },
            },
            responses: {
              "200": {
                description: "Bid successfully sent",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/SuccessResponse" },
                  },
                },
              },
              "400": {
                description: "Bad Request",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/ErrorResponse" },
                  },
                },
              },
              "404": {
                description: "User or House not found",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/ErrorResponse" },
                  },
                },
              },
              "500": {
                description: "Internal Server Error",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/ErrorResponse" },
                  },
                },
              },
            },
          },
        },
        "/bid/update/{id}": {
          put: {
            tags: ["Bid"],
            summary: "Update status of a bid",
            security: [{ BearerAuth: [] }],
            parameters: [
              {
                in: "path",
                name: "id",
                description: "ID of the bid to update",
                required: true,
                schema: {
                  type: "integer",
                },
              },
              {
                in: "query",
                name: "bid_type",
                description: "Type of bid (bid or counter)",
                required: true,
                schema: {
                  type: "string",
                },
              },
            ],
            requestBody: {
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/UpdateBidRequest" },
                },
              },
            },
            responses: {
              "200": {
                description: "Successfully updated bid status",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/SuccessResponse" },
                  },
                },
              },
              "400": {
                description: "Bad Request",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/ErrorResponse" },
                  },
                },
              },
              "404": {
                description: "Bid not found",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/ErrorResponse" },
                  },
                },
              },
              "500": {
                description: "Internal Server Error",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/ErrorResponse" },
                  },
                },
              },
            },
          },
        },
        "/bid/verify_payment": {
          put: {
            tags: ["Bid"],
            summary: "Verify payment for a bid",
            requestBody: {
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/VerifyPaymentRequest" },
                },
              },
            },
            responses: {
              "200": {
                description: "Payment successfully verified",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/SuccessResponse" },
                  },
                },
              },
              "400": {
                description: "Bad Request",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/ErrorResponse" },
                  },
                },
              },
              "404": {
                description: "Bid not found",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/ErrorResponse" },
                  },
                },
              },
              "500": {
                description: "Internal Server Error",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/ErrorResponse" },
                  },
                },
              },
            },
          },
        },
        "/transaction/landlord": {
          get: {
            tags: ["Transactions"],
            summary: "Get transactions for a landlord",
            security: [{ BearerAuth: [] }],
            responses: {
              "200": {
                description: "Successfully found transactions",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/FetchTransactionsSuccess",
                    },
                  },
                },
              },
              "500": {
                description: "Internal Server Error",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/ErrorResponse" },
                  },
                },
              },
            },
          },
        },
        "/transaction/tenant": {
          get: {
            tags: ["Transactions"],
            summary: "Get transactions for a tenant",
            security: [{ BearerAuth: [] }],
            responses: {
              "200": {
                description: "Successfully found transactions",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/FetchTransactionsSuccess",
                    },
                  },
                },
              },
              "500": {
                description: "Internal Server Error",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/ErrorResponse" },
                  },
                },
              },
            },
          },
        },
      },
    },
    apis: controllers.map((controller) => controller.name),
  };

  const specs = swaggerJsdoc(options);

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};

export default configureSwagger;
