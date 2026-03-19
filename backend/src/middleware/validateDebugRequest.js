import AppError from "../utils/AppError.js";

const fieldSettings = {
  language: {
    label: "programming language",
    maxLength: 50,
    emptyMessage: "Please choose the programming language for the code sample."
  },
  errorMessage: {
    label: "error message",
    maxLength: 2000,
    emptyMessage: "Please paste the error message you want DevStack to analyze."
  },
  code: {
    label: "code snippet",
    maxLength: 20000,
    emptyMessage: "Please paste the code snippet that is causing the problem."
  }
};

const validateTextField = (value, config) => {
  if (typeof value !== "string") {
    throw new AppError(`The ${config.label} must be provided as text.`, 400);
  }

  const trimmedValue = value.trim();

  if (!trimmedValue) {
    throw new AppError(config.emptyMessage, 400);
  }

  if (trimmedValue.length > config.maxLength) {
    throw new AppError(
      `The ${config.label} is too long. Please keep it under ${config.maxLength} characters.`,
      400
    );
  }

  return trimmedValue;
};

export const validateDebugAnalyzeRequest = (req, _res, next) => {
  try {
    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
      throw new AppError(
        "Please send a JSON body with language, errorMessage, and code.",
        400
      );
    }

    const language = validateTextField(req.body.language, fieldSettings.language);
    const errorMessage = validateTextField(
      req.body.errorMessage,
      fieldSettings.errorMessage
    );
    const code = validateTextField(req.body.code, fieldSettings.code);

    req.body = {
      language,
      errorMessage,
      code
    };

    next();
  } catch (error) {
    next(error);
  }
};
