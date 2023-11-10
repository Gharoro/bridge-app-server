import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { error_response } from "../utils/responses";

// middleware for authenticating jwt token
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return error_response(
      res,
      "Unauthorized - Missing or invalid Bearer token",
      401
    );
  }

  const token = authorizationHeader.split("Bearer ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    (req as any).user = decoded;
    next();
  } catch (err) {
    return error_response(res, "Unauthorized - Invalid Bearer token", 401);
  }
};

// middleware for authenticating user role
export const authenticateRole = (requiredRole: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (user.role !== requiredRole) {
      return error_response(res, "Not Allowed", 403);
    }

    next();
  };
};
