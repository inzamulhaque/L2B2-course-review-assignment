import { Router } from "express";
import { CategoryRoutes } from "../app/modules/Category/category.route";
import { CourseRoute } from "../app/modules/Course/course.route";
import { ReviewRoutes } from "../app/modules/Review/review.route";

const router: Router = Router();

const moduleRouters = [
  {
    path: "/categories",
    route: CategoryRoutes,
  },
  {
    path: "/",
    route: CourseRoute,
  },
  {
    path: "/reviews",
    route: ReviewRoutes,
  },
];

moduleRouters.forEach((route) => router.use(route.path, route.route));

export default router;
