import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { createCourseValidationSchema } from "./course.validation";
import { createCourse, updateCourse } from "./course.controller";
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

export const CourseRoute = router;
