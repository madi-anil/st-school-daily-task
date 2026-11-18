import { useState } from "react";
import PomodoroTimer from "./challenges/Pomodorotimer/PomodoroTimer";


const DAILY_TASKS = [
  { id: "pomodoro-timer", label: "Challenge 4: Pomodoro Timer", Component: PomodoroTimer },

];

export default function App() {
  const params = new URLSearchParams(window.location.search);
  const initialId = params.get("task") || DAILY_TASKS[0].id;

  const [selectedId, setSelectedId] = useState(initialId);
  const activeTask = DAILY_TASKS.find((t) => t.id === selectedId) || DAILY_TASKS[0];
  const ActiveComponent = activeTask.Component;

  const handleSelect = (id) => {
    setSelectedId(id);
    window.history.replaceState(null, "", `?task=${id}`);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "1rem", fontFamily: "sans-serif" }}>
      <nav style={{ display: "grid", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
        {DAILY_TASKS.map((task) => (
          <button
            key={task.id}
            type="button"
            onClick={() => handleSelect(task.id)}
            disabled={task.id === activeTask.id}
            style={{ padding: "0.5rem 1rem", cursor: task.id === activeTask.id ? "default" : "pointer" }}
          >
            {task.label}
          </button>
        ))}
      </nav>

      <main>
        <ActiveComponent />
      </main>
    </div>
  );
}