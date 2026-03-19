const DEFAULT_API_URL = "https://api.anthropic.com/v1/messages";
const DEFAULT_API_VERSION = "2023-06-01";
const DEFAULT_MODEL = "claude-sonnet-4-20250514";
const REQUEST_TIMEOUT_MS = 25000;

const buildFallbackImprovedCode = ({ language, errorMessage, code }) => {
  const header = `// Fallback ${language} debugging suggestion`;
  const note = `// Review this area for the reported issue: ${errorMessage}`;

  return `${header}\n${note}\n${code}`;
};

const buildFallbackResponse = ({
  language,
  errorMessage,
  code,
  reason
}) => ({
  explanation: `A full AI analysis was unavailable${reason ? ` because ${reason}` : ""}. The ${language} code should be reviewed around the reported error: "${errorMessage}".`,
  causes: [
    "The external debugging service was unavailable or returned an invalid response.",
    "The underlying issue may still come from incorrect assumptions about data shape, control flow, or missing guards."
  ],
  fix: "Check the failing code path manually, add validation or guard clauses around unsafe operations, and retry once the AI service is available.",
  improvedCode: buildFallbackImprovedCode({
    language,
    errorMessage,
    code
  }),
  debugSteps: [
    "Reproduce the issue with the smallest failing input.",
    "Inspect the variables and values involved near the error location.",
    "Add logging or guards, test the fix, and compare behavior before and after the change."
  ]
});

const extractTextContent = (payload) => {
  if (!payload || !Array.isArray(payload.content)) {
    return "";
  }

  return payload.content
    .filter((item) => item?.type === "text" && typeof item.text === "string")
    .map((item) => item.text)
    .join("\n")
    .trim();
};

const extractJsonCandidate = (text) => {
  const fencedMatch = text.match(/```json\s*([\s\S]*?)\s*```/i);
  if (fencedMatch) {
    return fencedMatch[1].trim();
  }

  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return text.slice(firstBrace, lastBrace + 1).trim();
  }

  return text.trim();
};

const normalizeStringArray = (value, fallback) => {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const normalized = value
    .filter((item) => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);

  return normalized.length > 0 ? normalized : fallback;
};

const normalizeString = (value, fallback) => {
  if (typeof value !== "string") {
    return fallback;
  }

  const trimmed = value.trim();
  return trimmed || fallback;
};

const sanitizeAnalysis = (parsed, fallback) => {
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return fallback;
  }

  return {
    explanation: normalizeString(parsed.explanation, fallback.explanation),
    causes: normalizeStringArray(parsed.causes, fallback.causes),
    fix: normalizeString(parsed.fix, fallback.fix),
    improvedCode: normalizeString(parsed.improvedCode, fallback.improvedCode),
    debugSteps: normalizeStringArray(parsed.debugSteps, fallback.debugSteps)
  };
};

const parseClaudeResponse = (rawText, fallback) => {
  try {
    const jsonCandidate = extractJsonCandidate(rawText);
    const parsed = JSON.parse(jsonCandidate);
    return sanitizeAnalysis(parsed, fallback);
  } catch {
    return fallback;
  }
};

const buildSystemPrompt = () => `
You are an expert debugging assistant.
Analyze the user's code, language, and error message.
Return only valid JSON with exactly these keys:
- explanation
- causes
- fix
- improvedCode
- debugSteps

Rules:
- Do not include markdown fences.
- Do not include any prose outside the JSON object.
- "causes" must be an array of strings.
- "debugSteps" must be an array of strings.
- "improvedCode" must be a string containing corrected or improved code.
`.trim();

const buildUserPrompt = ({ language, errorMessage, code }) => `
Language: ${language}
Error message: ${errorMessage}

Code:
${code}

Respond with JSON only in this shape:
{
  "explanation": "string",
  "causes": ["string", "string"],
  "fix": "string",
  "improvedCode": "string",
  "debugSteps": ["string", "string"]
}
`.trim();

export const generateDebugAnalysis = async ({
  language,
  errorMessage,
  code
}) => {
  // TODO: Add your real Claude API key in backend/.env before using live AI responses.
  const normalizedLanguage = language.trim();
  const normalizedError = errorMessage.trim();
  const fallback = buildFallbackResponse({
    language: normalizedLanguage,
    errorMessage: normalizedError,
    code,
    reason: "the AI service response could not be used"
  });

  const apiKey = process.env.CLAUDE_API_KEY;
  const apiUrl = process.env.CLAUDE_API_URL || DEFAULT_API_URL;
  const apiVersion = process.env.CLAUDE_API_VERSION || DEFAULT_API_VERSION;
  const model = process.env.CLAUDE_MODEL || DEFAULT_MODEL;

  if (!apiKey) {
    return buildFallbackResponse({
      language: normalizedLanguage,
      errorMessage: normalizedError,
      code,
      reason: "the Claude API key is missing"
    });
  }

  try {
    const signal =
      typeof AbortSignal !== "undefined" &&
      typeof AbortSignal.timeout === "function"
        ? AbortSignal.timeout(REQUEST_TIMEOUT_MS)
        : undefined;

    const response = await fetch(apiUrl, {
      method: "POST",
      signal,
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": apiVersion
      },
      body: JSON.stringify({
        model,
        max_tokens: 1400,
        temperature: 0,
        system: buildSystemPrompt(),
        messages: [
          {
            role: "user",
            content: buildUserPrompt({
              language: normalizedLanguage,
              errorMessage: normalizedError,
              code
            })
          },
          {
            role: "assistant",
            content: "{"
          }
        ]
      })
    });

    if (!response.ok) {
      let errorReason = `Claude API request failed with status ${response.status}`;

      try {
        const errorPayload = await response.json();
        const apiMessage = errorPayload?.error?.message;
        if (typeof apiMessage === "string" && apiMessage.trim()) {
          errorReason = apiMessage.trim();
        }
      } catch {
        // Ignore parse errors and keep the HTTP status fallback.
      }

      return buildFallbackResponse({
        language: normalizedLanguage,
        errorMessage: normalizedError,
        code,
        reason: errorReason
      });
    }

    const payload = await response.json();
    const extractedText = extractTextContent(payload);
    const responseText = extractedText.trim().startsWith("{")
      ? extractedText
      : `{${extractedText}`;

    return parseClaudeResponse(responseText, fallback);
  } catch (error) {
    const reason =
      error?.name === "TimeoutError"
        ? "the Claude request timed out"
        : error.message || "the request to Claude failed";

    return buildFallbackResponse({
      language: normalizedLanguage,
      errorMessage: normalizedError,
      code,
      reason
    });
  }
};
