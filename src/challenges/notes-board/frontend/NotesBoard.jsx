import { useEffect, useState } from "react";
import { addNote, deleteNote, getNotes } from "./notesApi";

export default function NotesBoard() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const list = await getNotes();
        if (active) setNotes(list);
      } catch (err) {
        if (active) setError(err.message || "Could not load notes");
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const created = await addNote({ title, body });
      setNotes((prev) => [created, ...prev]);
      setTitle("");
      setBody("");
    } catch (err) {
      setError(err.message || "Could not add note");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setError("");
    setDeletingId(id);
    try {
      await deleteNote(id);
      setNotes((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err.message || "Could not delete note");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div style={{ maxWidth: "760px", margin: "2rem auto", padding: "0 1rem", fontFamily: "sans-serif" }}>
      <h2>Notes Board</h2>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "0.75rem", marginBottom: "1.5rem" }}>
        <div>
          <label htmlFor="title" style={{ display: "block", marginBottom: "0.25rem" }}>
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Revise hooks"
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <div>
          <label htmlFor="body" style={{ display: "block", marginBottom: "0.25rem" }}>
            Body
          </label>
          <textarea
            id="body"
            name="body"
            rows={3}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="useEffect cleanup"
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <button type="submit" disabled={saving} style={{ width: "fit-content", padding: "0.5rem 1rem" }}>
          {saving ? "Adding..." : "Add Note"}
        </button>
      </form>

      {error && (
        <p role="alert" style={{ color: "#d93829", marginBottom: "1rem" }}>
          {error}
        </p>
      )}

      {loading ? (
        <p>Loading notes...</p>
      ) : notes.length === 0 ? (
        <p>No notes yet.</p>
      ) : (
        <div style={{ display: "grid", gap: "0.75rem" }}>
          {notes.map((note) => (
            <article
              key={note.id}
              style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "1rem" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem" }}>
                <div>
                  <h3 style={{ margin: "0 0 0.4rem" }}>{note.title}</h3>
                  <p style={{ margin: "0 0 0.5rem" }}>{note.body}</p>
                  {note.createdAt && <small style={{ color: "#666" }}>{note.createdAt}</small>}
                </div>
                <button
                  type="button"
                  disabled={deletingId === note.id}
                  onClick={() => handleDelete(note.id)}
                >
                  {deletingId === note.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}