/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import ZodValidationError from "../error/ZodError";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  let message = "Something went wrong!";
  let errorMessage = err.message;
  let errorDetails = err;
  let stack = err?.stack;

  if (err instanceof ZodError) {
    const error = ZodValidationError(err);
    message = error?.message;
    errorMessage = error?.errorMessage;
    errorDetails = error?.errorDetails;
    stack = error?.stack;
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errorMessage,
    errorDetails,
    stack,
  });
};

export default globalErrorHandler;
