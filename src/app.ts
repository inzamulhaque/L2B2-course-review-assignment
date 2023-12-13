import express, { Application } from "express";
import cors from "cors";
import router from "./routes";
import notFound from "./app/middlewares/notFound";
import globalErrorHandler from "./app/middlewares/globalErrorhandler";

const app: Application = express();

// parsers
app.use(express.json());
app.use(cors());

// applications routes
app.use("/api", router);

// api not found
app.all("*", notFound);

app.use(globalErrorHandler);

export default app;
