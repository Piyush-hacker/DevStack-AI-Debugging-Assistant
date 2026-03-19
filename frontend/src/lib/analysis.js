export const createEmptyAnalysis = () => ({
  explanation: "",
  causes: [],
  fix: "",
  improvedCode: "",
  debugSteps: []
});

export const normalizeAnalysis = (value) => ({
  explanation: value?.explanation || "",
  causes: Array.isArray(value?.causes) ? value.causes : [],
  fix: value?.fix || "",
  improvedCode: value?.improvedCode || "",
  debugSteps: Array.isArray(value?.debugSteps) ? value.debugSteps : []
});

export const hasAnalysisContent = (value) => {
  const analysis = normalizeAnalysis(value);

  return Boolean(
    analysis.explanation ||
      analysis.fix ||
      analysis.improvedCode ||
      analysis.causes.length ||
      analysis.debugSteps.length
  );
};
