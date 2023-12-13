import { Response } from "express";
import { TMeta } from "../interface/meta";

type TResponse<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  meta?: TMeta;
  data: T;
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  if (data?.meta && Object.keys(data?.meta as TMeta).length) {
    return res.status(data?.statusCode).json({
      success: data.success,
      statusCode: data?.statusCode,
      message: data.message,
      meta: data?.meta,
      data: data.data,
    });
  }

  res.status(data?.statusCode).json({
    success: data.success,
    statusCode: data?.statusCode,
    message: data.message,
    data: data.data,
  });
};

export default sendResponse;
