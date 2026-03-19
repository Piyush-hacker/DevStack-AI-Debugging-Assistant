function ResultCard({ title, children, className = "", actions = null }) {
  return (
    <section className={`panel p-6 ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
          {title}
        </h2>
        {actions}
      </div>
      <div className="mt-4 text-sm leading-7 text-slate-700">{children}</div>
    </section>
  );
}

export default ResultCard;
