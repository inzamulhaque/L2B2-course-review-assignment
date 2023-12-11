import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { createCourseIntoDB } from "./course.service";

const createCourse = catchAsync(async (req, res) => {
  // create course into DB
  const result = await createCourseIntoDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Course created successfully",
    data: result,
  });
});

export { createCourse };
