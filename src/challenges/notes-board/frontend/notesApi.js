const API_BASE = import.meta.env.VITE_NOTES_API_URL || "http://localhost:8000";

async function getErrorMessage(res, fallback) {
  try {
    const data = await res.json();
    return data.error || data.message || fallback;
  } catch {
    return fallback;
  }
}

export async function getNotes() {
  const res = await fetch(`${API_BASE}/api/notes`);
  if (!res.ok) {
    throw new Error(await getErrorMessage(res, "Failed to fetch notes"));
  }
  return res.json();
}

export async function addNote({ title, body }) {
  const res = await fetch(`${API_BASE}/api/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, body }),
  });
  if (!res.ok) {
    throw new Error(await getErrorMessage(res, "Failed to create note"));
  }
  return res.json();
}

export async function deleteNote(id) {
  const res = await fetch(`${API_BASE}/api/notes/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error(await getErrorMessage(res, "Failed to delete note"));
  }
}