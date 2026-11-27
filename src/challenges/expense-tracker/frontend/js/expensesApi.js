const envBase =
  import.meta.env.VITE_EXPENSE_API_URL || import.meta.env.VITE_API_URL;
const API_BASE =
  envBase && envBase.trim() ? envBase.trim().replace(/\/+$/, "") : "http://localhost:8080";

async function parseError(res, fallback) {
  try {
    const data = await res.json();
    if (data.errors && typeof data.errors === "object") {
      const messages = Object.values(data.errors).filter(Boolean);
      if (messages.length > 0) {
        return messages.join(" • ");
      }
    }
    return data.error || data.message || fallback;
  } catch {
    return fallback;
  }
}

export async function fetchExpenses() {
  const res = await fetch(`${API_BASE}/api/expenses`);
  if (!res.ok) {
    throw new Error(await parseError(res, "Failed to load expenses"));
  }
  return res.json();
}

export async function createExpense(payload) {
  const res = await fetch(`${API_BASE}/api/expenses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(await parseError(res, "Failed to add expense"));
  }
  return res.json();
}

export async function deleteExpenseById(id) {
  const res = await fetch(`${API_BASE}/api/expenses/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error(await parseError(res, "Failed to delete expense"));
  }
}

export async function fetchSummary() {
  const res = await fetch(`${API_BASE}/api/summary`);
  if (!res.ok) {
    throw new Error(await parseError(res, "Failed to load summary"));
  }
  return res.json();
}