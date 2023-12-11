import { Router } from "express";
import { CategoryRoutes } from "../app/modules/Category/category.route";
import { CourseRoute } from "../app/modules/Course/course.route";

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
];

moduleRouters.forEach((route) => router.use(route.path, route.route));

export default router;
