import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { createCategoryIntoDB } from "./category.service";

const createCategory = catchAsync(async (req, res) => {
  // create category
  const result = await createCategoryIntoDB(req.body);
  // object destructuring
  const { _id, name } = await result.toObject();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Category created successfully",
    data: { _id, name },
  });
});

export { createCategory };
