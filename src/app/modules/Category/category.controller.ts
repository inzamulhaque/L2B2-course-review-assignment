import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import {
  createCategoryIntoDB,
  getAllCategoriesFromDB,
} from "./category.service";

const createCategory = catchAsync(async (req, res) => {
  // create category into DB
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

const getAllCategory = catchAsync(async (req, res) => {
  // get all category from DB
  const result = await getAllCategoriesFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Categories retrieved successfully",
    data: result,
  });
});

export { createCategory, getAllCategory };
