import mongoose from "mongoose";

export interface TCastError {
  message: string;
  errorMessage: string;
  errorDetails: mongoose.Error.CastError;
  stack: string;
}
