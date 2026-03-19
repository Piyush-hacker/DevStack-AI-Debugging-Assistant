function LoadingState({ title, description }) {
  return (
    <div className="panel px-6 py-10">
      <div className="flex items-center gap-3">
        <span className="spinner" aria-hidden="true" />
        <div>
          <p className="text-sm font-semibold text-slate-900">{title}</p>
          <p className="text-sm text-slate-600">{description}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="h-28 animate-pulse rounded-3xl bg-slate-100" />
        <div className="h-28 animate-pulse rounded-3xl bg-slate-100" />
        <div className="h-28 animate-pulse rounded-3xl bg-slate-100 md:col-span-2" />
      </div>
    </div>
  );
}

export default LoadingState;
