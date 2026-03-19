import { Router } from "express";
import {
  analyzeDebug,
  getDebugHistory
} from "../controllers/debugController.js";
import { validateDebugAnalyzeRequest } from "../middleware/validateDebugRequest.js";

const router = Router();

router.post("/analyze", validateDebugAnalyzeRequest, analyzeDebug);
router.get("/history", getDebugHistory);

export default router;
