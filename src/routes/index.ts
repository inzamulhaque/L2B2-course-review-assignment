import { Router } from "express";
import { CategoryRoutes } from "../app/modules/Category/category.route";

const router: Router = Router();

const moduleRouters = [
  {
    path: "/categories",
    route: CategoryRoutes,
  },
];

moduleRouters.forEach((route) => router.use(route.path, route.route));

export default router;
