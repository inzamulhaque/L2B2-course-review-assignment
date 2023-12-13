import { ZodIssue } from "zod";

export interface TErrorDetails {
  issues: ZodIssue[];
  name: string;
}

export interface TZodValidationError {
  message: string;
  errorMessage: string;
  errorDetails: TErrorDetails;
  stack: string;
}
