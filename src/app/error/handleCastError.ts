import mongoose from "mongoose";
import { TCastError } from "../interface/castError";

const handleCastError = (err: mongoose.Error.CastError): TCastError => {
  const message = "Invalid ID";
  const errorMessage = `${err?.value} is not a valid ID!`;
  const errorDetails: mongoose.Error.CastError = err;
  const stack = err?.stack as string;

  const errorObject = {
    message,
    errorMessage,
    errorDetails,
    stack,
  };

  return errorObject;
};

export default handleCastError;
