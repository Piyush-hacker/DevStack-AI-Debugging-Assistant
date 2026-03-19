import mongoose from "mongoose";

const debugResponseSchema = new mongoose.Schema(
  {
    explanation: {
      type: String,
      required: true,
      trim: true
    },
    causes: {
      type: [String],
      required: true,
      default: []
    },
    fix: {
      type: String,
      required: true,
      trim: true
    },
    improvedCode: {
      type: String,
      required: true
    },
    debugSteps: {
      type: [String],
      required: true,
      default: []
    }
  },
  {
    _id: false
  }
);

const debugHistorySchema = new mongoose.Schema(
  {
    language: {
      type: String,
      required: true,
      trim: true
    },
    errorMessage: {
      type: String,
      required: true,
      trim: true
    },
    code: {
      type: String,
      required: true
    },
    response: {
      type: debugResponseSchema,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const DebugHistory = mongoose.model("DebugHistory", debugHistorySchema);

export default DebugHistory;
