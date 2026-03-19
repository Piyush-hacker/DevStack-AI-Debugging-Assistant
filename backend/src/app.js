import express from "express";
import cors from "cors";
import healthRoutes from "./routes/healthRoutes.js";
import debugRoutes from "./routes/debugRoutes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "DevStack backend is running"
  });
});

app.use("/api/health", healthRoutes);
app.use("/api/debug", debugRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
