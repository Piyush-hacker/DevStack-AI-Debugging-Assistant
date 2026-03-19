function EmptyState({ title, description, compact = false }) {
  return (
    <div
      className={`rounded-3xl border border-dashed border-slate-300 bg-slate-50/80 text-slate-600 ${
        compact ? "px-4 py-5 text-sm" : "px-6 py-10 text-center"
      }`}
    >
      <p className="text-base font-semibold text-slate-800">{title}</p>
      <p className={compact ? "mt-2" : "mx-auto mt-2 max-w-xl"}>{description}</p>
    </div>
  );
}

export default EmptyState;
