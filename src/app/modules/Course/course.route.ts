import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { createCourseValidationSchema } from "./course.validation";
import {
  createCourse,
  getBestRatedCourse,
  getCourseByIDWithReviews,
  updateCourse,
} from "./course.controller";
import { updateCategoryValidationSchema } from "../Category/category.validation";

const router: Router = Router();

router.post(
  "/course",
  validateRequest(createCourseValidationSchema),
  createCourse,
);

router.put(
  "/courses/:courseId",
  validateRequest(updateCategoryValidationSchema),
  updateCourse,
);

router.get("/courses/:courseId/reviews", getCourseByIDWithReviews);

router.get("/course/best", getBestRatedCourse);

export const CourseRoute = router;
