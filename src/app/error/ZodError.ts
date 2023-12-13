import { ZodError, ZodIssue } from "zod";
import { TZodValidationError } from "../interface/zodError";

const ZodValidationError = (err: ZodError): TZodValidationError => {
  const generateErrorMessage = (issues: ZodIssue[]) => {
    const errorMessageArray = issues?.map((issue: ZodIssue) => {
      const errorName = issue.path[issue.path.length - 1];
      return `${errorName} is ${issue.message.toLowerCase()}`;
    });

    return errorMessageArray.join(". ") + ".";
  };

  const errorMessage = generateErrorMessage(err?.issues);

  const errorObject = {
    message: "Validation Error",
    errorMessage,
    errorDetails: {
      issues: err?.issues,
      name: "ZodError",
    },
    stack: err?.stack as string,
  };

  return errorObject;
};

export default ZodValidationError;
