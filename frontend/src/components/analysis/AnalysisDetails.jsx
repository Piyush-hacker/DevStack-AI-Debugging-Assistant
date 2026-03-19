import CopyButton from "../CopyButton";
import EmptyState from "../EmptyState";
import ResultCard from "../ResultCard";
import { hasAnalysisContent, normalizeAnalysis } from "../../lib/analysis";

function AnalysisDetails({ result, emptyTitle, emptyDescription }) {
  const analysis = normalizeAnalysis(result);
  const causes = analysis.causes;
  const debugSteps = analysis.debugSteps;
  const hasResult = hasAnalysisContent(analysis);

  if (!hasResult) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <>
      <section className="grid gap-5 lg:grid-cols-2">
        <ResultCard title="Explanation">
          <p>{analysis.explanation}</p>
        </ResultCard>

        <ResultCard
          title="Suggested Fix"
          actions={<CopyButton value={analysis.fix} label="fix" />}
        >
          <p>{analysis.fix}</p>
        </ResultCard>

        <ResultCard title="Likely Causes">
          {causes.length > 0 ? (
            <ul className="space-y-3">
              {causes.map((cause) => (
                <li
                  key={cause}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  {cause}
                </li>
              ))}
            </ul>
          ) : (
            <p>No likely causes were returned for this analysis.</p>
          )}
        </ResultCard>

        <ResultCard title="Debugging Steps">
          {debugSteps.length > 0 ? (
            <ol className="space-y-3">
              {debugSteps.map((step, index) => (
                <li
                  key={`${index + 1}-${step}`}
                  className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p>No debugging steps were returned for this analysis.</p>
          )}
        </ResultCard>
      </section>

      <section className="mt-5">
        <ResultCard
          title="Improved Code"
          className="overflow-hidden"
          actions={<CopyButton value={analysis.improvedCode} label="code" />}
        >
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-950">
            <pre className="min-h-40 whitespace-pre-wrap px-5 py-4 font-mono text-[13px] leading-6 text-slate-100">
              <code>{analysis.improvedCode}</code>
            </pre>
          </div>
        </ResultCard>
      </section>
    </>
  );
}

export default AnalysisDetails;
