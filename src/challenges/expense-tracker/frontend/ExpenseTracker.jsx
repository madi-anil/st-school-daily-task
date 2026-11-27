import { useEffect, useState } from "react";
import {
  createExpense,
  deleteExpenseById,
  fetchExpenses,
  fetchSummary,
} from "./js/expensesApi";
import "./ExpenseTracker.css";

const CATEGORIES = ["Food", "Travel", "Bills", "Shopping", "Other"];

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function formatMoney(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return "0.00";
  return num.toFixed(2);
}

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({ total: 0, byCategory: [] });
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState(todayIsoDate);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function refreshAll() {
    const [listData, summaryData] = await Promise.all([
      fetchExpenses(),
      fetchSummary(),
    ]);
    setExpenses(Array.isArray(listData) ? listData : []);
    setSummary({
      total: summaryData?.total ?? 0,
      byCategory: Array.isArray(summaryData?.byCategory)
        ? summaryData.byCategory
        : [],
    });
  }

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setError("");
        const [listData, summaryData] = await Promise.all([
          fetchExpenses(),
          fetchSummary(),
        ]);
        if (!active) return;
        setExpenses(Array.isArray(listData) ? listData : []);
        setSummary({
          total: summaryData?.total ?? 0,
          byCategory: Array.isArray(summaryData?.byCategory)
            ? summaryData.byCategory
            : [],
        });
      } catch (err) {
        if (active) setError(err.message || "Failed to load expenses");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await createExpense({
        title: title.trim(),
        amount: amount === "" ? null : Number(amount),
        category,
        date,
      });
      setTitle("");
      setAmount("");
      setDate(todayIsoDate());
      await refreshAll();
    } catch (err) {
      setError(err.message || "Could not create expense");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    setError("");
    try {
      await deleteExpenseById(id);
      await refreshAll();
    } catch (err) {
      setError(err.message || "Could not delete expense");
    }
  }

  const grandTotal = Number(summary.total) || 0;

  return (
    <div className="et-page">
      <div className="et-container">
        <header className="et-header">
          <h1>Expense Tracker with Summary</h1>
          <p>Add expenses, inspect category shares, and manage your list.</p>
        </header>

        {error && (
          <div className="et-error" role="alert">
            {error}
          </div>
        )}

        <div className="et-grid">
          <section className="et-card">
            <h2>Add Expense</h2>
            <form className="et-form" onSubmit={handleSubmit}>
              <label className="et-field">
                <span>Title</span>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Campus lunch or bus pass"
                />
              </label>

              <label className="et-field">
                <span>Amount</span>
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                />
              </label>

              <label className="et-field">
                <span>Category</span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </label>

              <label className="et-field">
                <span>Date</span>
                <input
                  type="date"
                  max={todayIsoDate()}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </label>

              <button
                type="submit"
                className="et-btn-primary"
                disabled={submitting}
              >
                {submitting ? "Saving..." : "Add Expense"}
              </button>
            </form>
          </section>

          <section className="et-card">
            <div className="et-summary-head">
              <h2>Summary</h2>
              <div className="et-grand-total">
                <span>Grand Total</span>
                <strong>{formatMoney(grandTotal)}</strong>
              </div>
            </div>

            {summary.byCategory.length === 0 ? (
              <p className="et-empty">No expenses recorded yet.</p>
            ) : (
              <div className="et-bars">
                {summary.byCategory.map((item) => {
                  const catTotal = Number(item.total) || 0;
                  const sharePct =
                    grandTotal > 0 ? (catTotal / grandTotal) * 100 : 0;
                  return (
                    <div key={item.category} className="et-bar-row">
                      <div className="et-bar-meta">
                        <span className="et-bar-cat">
                          {item.category} ({item.count})
                        </span>
                        <span className="et-bar-val">
                          {formatMoney(catTotal)} ({sharePct.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="et-bar-track">
                        <div
                          className="et-bar-fill"
                          style={{ width: `${Math.min(100, sharePct)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        <section className="et-card et-table-card">
          <h2>Expenses</h2>
          {loading ? (
            <p className="et-empty">Loading expenses...</p>
          ) : expenses.length === 0 ? (
            <p className="et-empty">No expenses to display.</p>
          ) : (
            <div className="et-table-wrap">
              <table className="et-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th className="et-num">Amount</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((exp) => (
                    <tr key={exp.id}>
                      <td>{exp.date}</td>
                      <td>{exp.title}</td>
                      <td>
                        <span className="et-badge">{exp.category}</span>
                      </td>
                      <td className="et-num">{formatMoney(exp.amount)}</td>
                      <td>
                        <button
                          type="button"
                          className="et-btn-delete"
                          onClick={() => handleDelete(exp.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}