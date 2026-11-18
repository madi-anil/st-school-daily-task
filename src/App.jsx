import SignupWizard from "./challenges/multi-step-signup/SignupWizard";
import PomodoroTimer from "./challenges/Pomodorotimer/PomodoroTimer";

const DAILY_TASKS = {
  "multi-step-signup": SignupWizard,
  "pomodoro-timer": PomodoroTimer,
};

export default function App() {
  const params = new URLSearchParams(window.location.search);
  const taskKey = params.get("task");

  const ActiveComponent = DAILY_TASKS[taskKey] || SignupWizard;

  return <ActiveComponent />;
}