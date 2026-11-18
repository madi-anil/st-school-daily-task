import SignupWizard from "./challenges/multi-step-signup/SignupWizard";
import PomodoroTimer from "./challenges/Pomodorotimer/PomodoroTimer";

const DAILY_TASKS = {
  "multi-step-signup": SignupWizard,
  "pomodoro-timer": PomodoroTimer,
};

export default function App() {
  const pathParts = window.location.pathname.split("/").filter(Boolean);
  const slug = pathParts[0] === "challenges" ? pathParts[1] : pathParts[0];

  const ActiveComponent = DAILY_TASKS[slug] || SignupWizard;

  return <ActiveComponent />;
}