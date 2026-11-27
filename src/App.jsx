import SignupWizard from "./challenges/multi-step-signup/SignupWizard";
import PomodoroTimer from "./challenges/Pomodorotimer/PomodoroTimer";
import ShoppingCartApp from "./challenges/shopping-cart/ShoppingCartApp";
import { PostExplorer } from "./challenges/PostExplorer/components/PostExplorer";
import EmployeeDirectory from "./challenges/Performance_Tuned_Big_List/components/EmployeeDirectory";
import NotesBoard from "./challenges/notes-board/frontend/NotesBoard";
import SignupForm from "./challenges/Server_Validated _Signup/frontend/SignupForm";
import ProductCatalog from "./challenges/Paginated_Product_Catalog/frontend/ProductCatalog";
import TextAnalyzer from "./challenges/Text_Analyzer/frontend/TextAnalyzer";
import ExpenseTracker from "./challenges/expense-tracker/frontend/ExpenseTracker";
const DAILY_TASKS = {
  "notes-board": NotesBoard,
  "shopping-cart": ShoppingCartApp,
  "multi-step-signup": SignupWizard,
  "pomodoro-timer": PomodoroTimer,
  "PostExplorer": PostExplorer,
  "performance-tuned-big-list": EmployeeDirectory,
  "server-validated-signup": SignupForm,
  "paginated-product-catalog": ProductCatalog,
  "textAnalyzer": TextAnalyzer,
  "expense-Tracker": ExpenseTracker
};

export default function App() {
  const pathParts = window.location.pathname.split("/").filter(Boolean);
  const slug = pathParts[0] === "challenges" ? pathParts[1] : pathParts[0];

  const ActiveComponent = DAILY_TASKS[slug] || ExpenseTracker;

  return <ActiveComponent />;
}