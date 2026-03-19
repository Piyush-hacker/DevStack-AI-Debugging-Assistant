import { useState } from "react";
import AnalysisDetails from "../components/analysis/AnalysisDetails";
import EmptyState from "../components/EmptyState";
import ErrorAlert from "../components/ErrorAlert";
import LoadingState from "../components/LoadingState";
import PageHero from "../components/PageHero";
import api, { getApiErrorMessage } from "../lib/api";
import { demoAnalyzeResponse } from "../lib/demoData";
import { createEmptyAnalysis, hasAnalysisContent } from "../lib/analysis";

const languageOptions = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C++",
  "C#",
  "Go",
  "Rust",
  "PHP"
];

const initialForm = {
  language: "JavaScript",
  errorMessage: "",
  code: ""
};

const validateForm = ({ errorMessage, code }) => {
  if (!errorMessage.trim()) {
    return "Please add the error message you want DevStack to analyze.";
  }

  if (!code.trim()) {
    return "Please paste the code snippet that is causing the issue.";
  }

  return "";
};

function HomePage() {
  const [formData, setFormData] = useState(initialForm);
  const [result, setResult] = useState(createEmptyAnalysis());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const validationMessage = validateForm(formData);

    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    setLoading(true);
    setResult(createEmptyAnalysis());

    try {
      const response = await api.post("/debug/analyze", formData);
      setResult(response.data);
    } catch (requestError) {
      setResult(demoAnalyzeResponse);
      setError(
        `${getApiErrorMessage(
          requestError,
          "Unable to analyze the issue right now."
        )} Showing sample analysis data for demo mode.`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHero
        title="AI-powered debugging that looks sharp on camera and stays easy to use live."
        description="Paste code, describe the failure, and get a structured debugging breakdown with likely causes, a suggested fix, improved code, and clear next steps."
      >
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="soft-panel p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Backend
                </p>
                <p className="mt-2 text-sm text-slate-700">
                  Axios request to `/api/debug/analyze`
                </p>
              </div>
              <div className="soft-panel p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Output
                </p>
                <p className="mt-2 text-sm text-slate-700">
                  Clean JSON-based analysis cards
                </p>
              </div>
              <div className="soft-panel p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Demo Ready
                </p>
                <p className="mt-2 text-sm text-slate-700">
                  Clear form, fast results, polished presentation
                </p>
              </div>
            </div>
          </div>

          <form className="soft-panel p-5 sm:p-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <label
                  htmlFor="language"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Language
                </label>
                <select
                  id="language"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="field"
                >
                  {languageOptions.map((language) => (
                    <option key={language} value={language}>
                      {language}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="errorMessage"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Error Message
                </label>
                <textarea
                  id="errorMessage"
                  name="errorMessage"
                  value={formData.errorMessage}
                  onChange={handleChange}
                  placeholder="TypeError: Cannot read properties of undefined..."
                  className="field min-h-32 resize-y"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="code"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Code
                </label>
                <textarea
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="Paste the code that is failing..."
                  className="field min-h-[260px] resize-y font-mono text-[13px] leading-6"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {loading ? (
                  <>
                    <span className="spinner" aria-hidden="true" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Debug Issue"
                )}
              </button>

              <ErrorAlert message={error} variant="info" />
            </div>
          </form>
        </div>
      </PageHero>

      <section className="mt-8">
        {loading ? (
          <LoadingState
            title="Analyzing your code"
            description="DevStack is sending the request and preparing a structured debugging summary."
          />
        ) : (
          <AnalysisDetails
            result={result}
            emptyTitle="Ready for your first analysis"
            emptyDescription="Choose a language, paste the error and code, then run an analysis to see explanation, causes, fixes, and improved code here."
          />
        )}
      </section>

      {!loading && !hasAnalysisContent(result) ? (
        <section className="mt-5">
          <EmptyState
            compact
            title="Tip"
            description="Start with the smallest code sample that still reproduces the bug. It usually leads to cleaner explanations and better fixes."
          />
        </section>
      ) : null}
    </>
  );
}

export default HomePage;
