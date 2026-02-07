import React, { useEffect, useMemo, useRef, useState } from "react";
import { chatFoods, searchFoods } from "./api.js";
import Logo from "./Logo.jsx";

/* ─── helpers ─── */
function scoreColor(score) {
  if (score >= 0.7) return "var(--clr-emerald)";
  if (score >= 0.45) return "var(--clr-amber)";
  return "var(--clr-slate)";
}

function calorieTag(cal) {
  if (cal <= 200) return { label: "Low cal", cls: "tag--green" };
  if (cal <= 500) return { label: "Medium", cls: "tag--amber" };
  return { label: "High cal", cls: "tag--red" };
}

const SAMPLE_QUERIES = [
  "Spicy Thai noodles",
  "Healthy Italian salad",
  "Chocolate dessert under 300 cal",
  "Comfort food for cold weather",
  "High-protein breakfast",
];

/* ─── main component ─── */
export default function App() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({
    cuisine_filter: "",
    max_calories: "",
    n_results: 5,
  });
  const [results, setResults] = useState([]);
  const [chatText, setChatText] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("search");
  const [error, setError] = useState("");
  const [backendOk, setBackendOk] = useState(null);
  const inputRef = useRef(null);

  const canSubmit = useMemo(() => query.trim().length > 0, [query]);

  /* health check on mount */
  useEffect(() => {
    const base =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
    fetch(`${base}/api/health`)
      .then((r) => r.ok && setBackendOk(true))
      .catch(() => setBackendOk(false));
  }, []);

  /* ── actions ── */
  async function handleSearch() {
    setError("");
    setChatText("");
    setLoading(true);
    try {
      const payload = { query: query.trim(), n_results: filters.n_results };
      if (filters.cuisine_filter.trim())
        payload.cuisine_filter = filters.cuisine_filter.trim();
      if (filters.max_calories !== "" && filters.max_calories !== undefined)
        payload.max_calories = Number(filters.max_calories);
      const data = await searchFoods(payload);
      setResults(data.results || []);
      if ((data.results || []).length === 0)
        setError("No dishes matched — try different keywords.");
    } catch {
      setError("Could not reach the backend. Is uvicorn running?");
    } finally {
      setLoading(false);
    }
  }

  async function handleChat() {
    setError("");
    setLoading(true);
    try {
      const data = await chatFoods({ query: query.trim() });
      setChatText(data.response || "");
      setResults(data.results || []);
    } catch {
      setError("AI response failed. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  }

  function submit(e) {
    e.preventDefault();
    if (!canSubmit || loading) return;
    mode === "chat" ? handleChat() : handleSearch();
  }

  function pickSample(q) {
    setQuery(q);
    inputRef.current?.focus();
  }

  /* ─── render ─── */
  return (
    <div className="app">
      {/* ── top-bar ── */}
      <nav className="topbar">
        <div className="topbar__brand">
          <Logo size={36} />
          <span className="topbar__name">
            Savory<strong>AI</strong>
          </span>
        </div>

        <div className="topbar__right">
          <span
            className={`status-dot ${backendOk === true ? "status-dot--ok" : backendOk === false ? "status-dot--err" : ""}`}
          />
          <span className="topbar__status">
            {backendOk === true
              ? "API connected"
              : backendOk === false
                ? "API offline"
                : "Checking…"}
          </span>
        </div>
      </nav>

      {/* ── hero ── */}
      <header className="hero">
        <h1 className="hero__title">
          Discover your next <span className="gradient-text">favourite dish</span>
        </h1>
        <p className="hero__sub">
          Powered by vector similarity search &amp; a local LLM — no API keys,
          no cloud, 100 % on your machine.
        </p>

        {/* quick chips */}
        <div className="chips">
          {SAMPLE_QUERIES.map((q) => (
            <button
              key={q}
              type="button"
              className="chip"
              onClick={() => pickSample(q)}
            >
              {q}
            </button>
          ))}
        </div>
      </header>

      {/* ── search panel ── */}
      <main className="main">
        <form className="search-panel glass" onSubmit={submit}>
          {/* mode tabs */}
          <div className="tabs">
            <button
              type="button"
              className={`tab ${mode === "search" ? "tab--active" : ""}`}
              onClick={() => setMode("search")}
            >
              <SearchIcon /> Search
            </button>
            <button
              type="button"
              className={`tab ${mode === "chat" ? "tab--active" : ""}`}
              onClick={() => setMode("chat")}
            >
              <SparkleIcon /> Ask AI
            </button>
          </div>

          {/* query input */}
          <div className="search-panel__input-row">
            <input
              ref={inputRef}
              className="search-input"
              type="text"
              placeholder={
                mode === "chat"
                  ? "Ask anything about food…"
                  : "Search dishes, ingredients, cuisines…"
              }
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              type="submit"
              className="btn btn--primary"
              disabled={!canSubmit || loading}
            >
              {loading ? <Spinner /> : mode === "chat" ? "Ask" : "Search"}
            </button>
          </div>

          {/* filters (search mode only) */}
          {mode === "search" && (
            <div className="filters" key="filters">
              <label className="filter">
                <span>Cuisine</span>
                <input
                  type="text"
                  placeholder="Italian, Thai…"
                  value={filters.cuisine_filter}
                  onChange={(e) =>
                    setFilters((p) => ({ ...p, cuisine_filter: e.target.value }))
                  }
                />
              </label>
              <label className="filter">
                <span>Max cal</span>
                <input
                  type="number"
                  min="0"
                  placeholder="500"
                  value={filters.max_calories}
                  onChange={(e) =>
                    setFilters((p) => ({ ...p, max_calories: e.target.value }))
                  }
                />
              </label>
              <label className="filter">
                <span>Show</span>
                <select
                  value={filters.n_results}
                  onChange={(e) =>
                    setFilters((p) => ({
                      ...p,
                      n_results: Number(e.target.value),
                    }))
                  }
                >
                  {[3, 5, 8, 10].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}

          {error && (
            <p className="toast toast--error">
              <span>⚠</span> {error}
            </p>
          )}
        </form>

        {/* ── AI response ── */}
        {chatText && (
          <section className="ai-card glass animate-in">
            <div className="ai-card__header">
              <SparkleIcon />
              <h2>AI Recommendation</h2>
            </div>
            <p className="ai-card__body">{chatText}</p>
          </section>
        )}

        {/* ── results ── */}
        {results.length > 0 && (
          <section className="results-section animate-in">
            <div className="results-header">
              <h2>
                Top matches{" "}
                <span className="results-count">{results.length}</span>
              </h2>
            </div>

            <div className="result-grid">
              {results.map((item, idx) => {
                const ct = calorieTag(item.food_calories_per_serving);
                return (
                  <article
                    className="card glass animate-in"
                    key={item.food_id}
                    style={{ animationDelay: `${idx * 60}ms` }}
                  >
                    <div className="card__body">
                      <div className="card__top">
                        <h3 className="card__name">{item.food_name}</h3>
                        <div
                          className="score-badge"
                          style={{
                            "--score-clr": scoreColor(item.similarity_score),
                          }}
                        >
                          {Math.round(item.similarity_score * 100)}%
                        </div>
                      </div>

                      <div className="card__tags">
                        <span className="tag tag--cuisine">
                          {item.cuisine_type}
                        </span>
                        <span className={`tag ${ct.cls}`}>
                          🔥 {item.food_calories_per_serving} cal
                        </span>
                      </div>

                      <p className="card__desc">{item.food_description}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* empty state */}
        {!loading && results.length === 0 && !error && (
          <section className="empty-state animate-in">
            <div className="empty-state__icon">🍜</div>
            <p>
              Type a query above and hit <strong>Search</strong> or{" "}
              <strong>Ask AI</strong> to discover delicious dishes.
            </p>
          </section>
        )}
      </main>

      {/* ── footer ── */}
      <footer className="footer">
        <p>
          Built with <span className="heart">♥</span> using React, FastAPI,
          ChromaDB &amp; Ollama — 100 % local &amp; free
        </p>
      </footer>
    </div>
  );
}

/* ── inline SVG icons ── */
function SearchIcon() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l2.09 6.26L20.18 10l-6.09 1.74L12 18l-2.09-6.26L3.82 10l6.09-1.74L12 2z" />
    </svg>
  );
}

function Spinner() {
  return <span className="spinner" />;
}
