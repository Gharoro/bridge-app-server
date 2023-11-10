import { Request, Response } from "express";

export const success_response = (
  res: Response,
  message: string,
  data: [] | {} | null,
  status_code: number
) => {
  return res.status(status_code).json({
    success: true,
    message,
    data,
  });
};

export const error_response = (
  res: Response,
  error: string,
  status_code: number
) => {
  return res.status(status_code).json({
    success: false,
    error,
  });
};
