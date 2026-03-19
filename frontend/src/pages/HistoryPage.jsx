import { useEffect, useMemo, useState } from "react";
import AnalysisDetails from "../components/analysis/AnalysisDetails";
import EmptyState from "../components/EmptyState";
import ErrorAlert from "../components/ErrorAlert";
import LoadingState from "../components/LoadingState";
import PageHero from "../components/PageHero";
import ResultCard from "../components/ResultCard";
import api, { getApiErrorMessage } from "../lib/api";
import { demoHistoryEntries } from "../lib/demoData";
import { normalizeAnalysis } from "../lib/analysis";
import { formatDateTime, getErrorPreview } from "../lib/formatters";

function HistoryPage() {
  const [savedAnalyses, setSavedAnalyses] = useState([]);
  const [selectedAnalysisId, setSelectedAnalysisId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await api.get("/debug/history");
        const entries = response.data?.data || [];
        const nextEntries = entries.length > 0 ? entries : demoHistoryEntries;
        setSavedAnalyses(nextEntries);
        setSelectedAnalysisId(nextEntries[0]?.id || "");
      } catch (requestError) {
        setSavedAnalyses(demoHistoryEntries);
        setSelectedAnalysisId(demoHistoryEntries[0]?.id || "");
        setError(
          `${getApiErrorMessage(
            requestError,
            "Unable to load debug history right now."
          )} Showing demo history data instead.`
        );
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  const selectedEntry = useMemo(
    () =>
      savedAnalyses.find((item) => item.id === selectedAnalysisId) || null,
    [savedAnalyses, selectedAnalysisId]
  );

  return (
    <>
      <PageHero
        title="Review previous debugging sessions."
        description="Open any saved analysis to revisit the original issue, inspect the generated explanation, and walk through the saved fix and debugging steps."
      />

      {loading ? (
        <section className="mt-8">
          <LoadingState
            title="Loading saved analyses"
            description="DevStack is fetching your previous debugging sessions so you can reopen them."
          />
        </section>
      ) : error ? (
        <section className="mt-8">
          <ErrorAlert message={error} variant="info" />
        </section>
      ) : (
        <section className="mt-8 grid gap-5 xl:grid-cols-[0.92fr_1.08fr]">
          <div className="space-y-4">
            {savedAnalyses.length === 0 ? (
              <EmptyState
                title="No saved analyses yet"
                description="Run an analysis from the Analyzer page and every successful result will show up here for quick review."
              />
            ) : (
              savedAnalyses.map((item) => {
                const isActive = item.id === selectedAnalysisId;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedAnalysisId(item.id)}
                    className={`w-full text-left transition ${
                      isActive ? "scale-[1.01]" : "hover:-translate-y-0.5"
                    }`}
                  >
                    <article
                      className={`soft-panel p-5 ${
                        isActive
                          ? "border-slate-900 bg-slate-950 text-white shadow-[0_16px_40px_rgba(15,23,42,0.18)]"
                          : "text-slate-900"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p
                            className={`text-xs font-semibold uppercase tracking-[0.2em] ${
                              isActive ? "text-slate-300" : "text-slate-500"
                            }`}
                          >
                            {item.language}
                          </p>
                          <h2
                            className={`mt-2 text-base font-semibold ${
                              isActive ? "text-white" : "text-slate-900"
                            }`}
                          >
                            {getErrorPreview(item.errorMessage)}
                          </h2>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs ${
                            isActive
                              ? "bg-white/10 text-slate-200"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {item.isDemo ? "Demo" : "Saved"}
                        </span>
                      </div>
                      <p
                        className={`mt-4 text-sm ${
                          isActive ? "text-slate-300" : "text-slate-500"
                        }`}
                      >
                        {formatDateTime(item.createdAt)}
                      </p>
                    </article>
                  </button>
                );
              })
            )}
          </div>

          <div className="space-y-5">
            {selectedEntry ? (
              <>
                <ResultCard title="Saved Analysis">
                  <div className="flex flex-wrap gap-3 text-sm">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                      {selectedEntry.language}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                      {formatDateTime(selectedEntry.createdAt)}
                    </span>
                    {selectedEntry.isDemo ? (
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-700">
                        Demo data
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    {selectedEntry.errorMessage}
                  </p>
                </ResultCard>

                <AnalysisDetails
                  result={normalizeAnalysis(selectedEntry.analysis)}
                  emptyTitle="No analysis selected"
                  emptyDescription="Choose an item from the list to open its full saved explanation, fix, and improved code."
                />
              </>
            ) : (
              <EmptyState
                title="Select a saved analysis"
                description="Choose an item from the history list to open the full debugging details."
              />
            )}
          </div>
        </section>
      )}
    </>
  );
}

export default HistoryPage;
