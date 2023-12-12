import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import {
  createCourseIntoDB,
  getBestRatedCourseFromDB,
  getCourseWithReviewFromDB,
  updateCourseIntoDB,
} from "./course.service";

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

const updateCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  // update course into DB
  const result = await updateCourseIntoDB(courseId, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Course updated successfully",
    data: result,
  });
});

const getCourseByIDWithReviews = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  // get course with reviews
  const result = await getCourseWithReviewFromDB(courseId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Course and Reviews retrieved successfully",
    data: result,
  });
});

const getBestRatedCourse = catchAsync(async (req, res) => {
  // get best rated course
  const result = await getBestRatedCourseFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Best course retrieved successfully",
    data: result,
  });
});

export {
  createCourse,
  updateCourse,
  getCourseByIDWithReviews,
  getBestRatedCourse,
};
