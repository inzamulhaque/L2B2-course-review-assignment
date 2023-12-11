import express, { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { createCategoryValidationSchema } from "./category.validation";
import { createCategory } from "./category.controller";

const router: Router = express.Router();

router.post(
  "/",
  validateRequest(createCategoryValidationSchema),
  createCategory,
);

export const CategoryRoutes = router;
