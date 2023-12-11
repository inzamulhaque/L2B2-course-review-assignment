import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { createReviewValidationSchema } from "./review.validation";
import { createReview } from "./review.controller";

const router: Router = Router();

router.post("/", validateRequest(createReviewValidationSchema), createReview);

export const ReviewRoutes = router;
