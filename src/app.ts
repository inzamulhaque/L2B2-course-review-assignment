import express, { Application } from "express";
import cors from "cors";

const app: Application = express();

// parsers
app.use(express.json());
app.use(cors());

// applications routes
// app.use("/api");

export default app;
