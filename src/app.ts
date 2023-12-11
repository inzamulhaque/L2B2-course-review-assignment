import express, { Application } from "express";
import cors from "cors";
import router from "./routes";

const app: Application = express();

// parsers
app.use(express.json());
app.use(cors());

// applications routes
app.use("/api", router);

export default app;
