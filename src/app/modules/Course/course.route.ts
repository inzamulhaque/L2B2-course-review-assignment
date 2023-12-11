import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { createCourseValidationSchema } from "./course.validation";
import { createCourse } from "./course.controller";

const router: Router = Router();

router.post(
  "/course",
  validateRequest(createCourseValidationSchema),
  createCourse,
);

export const CourseRoute = router;
