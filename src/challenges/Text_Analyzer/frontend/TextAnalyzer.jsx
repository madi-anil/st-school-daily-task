import { useState } from "react";
import "./TextAnalyzer.css";

const API_URL = "http://localhost:8080/api/analyze";

export default function TextAnalyzer() {
  const [text, setText] = useState("");
  const [ignoreStopWords, setIgnoreStopWords] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, ignoreStopWords }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to analyze text");
        setResult(null);
        return;
      }

      setResult(data);
    } catch {
      setError("Cannot connect to backend server on port 8080.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const maxCount =
    result && result.topWords.length > 0
      ? Math.max(...result.topWords.map((item) => item.count))
      : 1;

  return (
    <div className="analyzer-container">
      <div className="analyzer-card">
        <h1>Text Analyzer</h1>

        <form onSubmit={handleAnalyze}>
          <textarea
            className="analyzer-textarea"
            rows={6}
            placeholder="Paste or type your text here to analyze..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <div className="analyzer-meta-row">
            <span className="char-counter">{text.length} characters</span>

            <label className="stopword-toggle">
              <input
                type="checkbox"
                checked={ignoreStopWords}
                onChange={(e) => setIgnoreStopWords(e.target.checked)}
              />
              Exclude stop words (the, a, is...)
            </label>
          </div>

          <button type="submit" className="analyze-btn" disabled={loading}>
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </form>

        {error && <div className="analyzer-error">{error}</div>}

        {result && (
          <div className="results-section">
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-label">Words</span>
                <span className="stat-value">{result.words}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Sentences</span>
                <span className="stat-value">{result.sentences}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Unique Words</span>
                <span className="stat-value">{result.uniqueWords}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Reading Time</span>
                <span className="stat-value">{result.readingTimeSeconds}s</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Longest Word</span>
                <span className="stat-value longest">
                  {result.longestWord || "—"}
                </span>
              </div>
            </div>

            <div className="top-words-section">
              <h2>Top Words</h2>
              {result.topWords.length === 0 ? (
                <p className="empty-words">No words to display.</p>
              ) : (
                <div className="bars-list">
                  {result.topWords.map((item) => {
                    const widthPct = Math.round((item.count / maxCount) * 100);
                    return (
                      <div key={item.word} className="bar-row">
                        <span className="bar-word">{item.word}</span>
                        <div className="bar-track">
                          <div
                            className="bar-fill"
                            style={{ width: `${widthPct}%` }}
                          />
                        </div>
                        <span className="bar-count">{item.count}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}