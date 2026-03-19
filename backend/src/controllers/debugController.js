import DebugHistory from "../models/DebugHistory.js";
import { generateDebugAnalysis } from "../services/claudeService.js";
import asyncHandler from "../utils/asyncHandler.js";

const mapDebugHistoryRecord = (record) => ({
  id: record._id.toString(),
  language: record.language,
  errorMessage: record.errorMessage,
  code: record.code,
  analysis: record.response,
  createdAt: record.createdAt,
  updatedAt: record.updatedAt
});

export const analyzeDebug = asyncHandler(async (req, res) => {
  const { language, errorMessage, code } = req.body;

  const analysis = await generateDebugAnalysis({
    language,
    errorMessage,
    code
  });

  await DebugHistory.create({
    language,
    errorMessage,
    code,
    response: analysis
  });

  res.status(201).json(analysis);
});

export const getDebugHistory = asyncHandler(async (req, res) => {
  const history = await DebugHistory.find()
    .sort({ createdAt: -1 })
    .select("-__v")
    .lean();

  res.status(200).json({
    success: true,
    count: history.length,
    data: history.map(mapDebugHistoryRecord)
  });
});
