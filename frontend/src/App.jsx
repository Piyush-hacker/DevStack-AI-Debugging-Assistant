import { NavLink, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import HistoryPage from "./pages/HistoryPage";

const navLinkClassName = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-medium transition ${
    isActive
      ? "bg-slate-950 text-white shadow-sm"
      : "text-slate-600 hover:bg-white hover:text-slate-900"
  }`;

function App() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.18),_transparent_28%),linear-gradient(180deg,_#f8fafc_0%,_#e2e8f0_100%)] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="panel mb-8 px-6 py-5 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                DevStack
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </div>
              <p className="mt-3 text-sm text-slate-600">
                Debug smarter with a clean analysis flow and a reviewable history.
              </p>
            </div>

            <nav className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-slate-100/80 p-1.5">
              <NavLink to="/" end className={navLinkClassName}>
                Analyzer
              </NavLink>
              <NavLink to="/history" className={navLinkClassName}>
                History
              </NavLink>
            </nav>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </div>
    </main>
  );
}

export default App;
