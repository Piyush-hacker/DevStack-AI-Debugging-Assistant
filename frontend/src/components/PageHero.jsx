function PageHero({ title, description, children = null }) {
  return (
    <section className="panel overflow-hidden px-6 py-8 lg:px-10 lg:py-10">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
          {description}
        </p>
      </div>
      {children ? <div className="mt-8">{children}</div> : null}
    </section>
  );
}

export default PageHero;
