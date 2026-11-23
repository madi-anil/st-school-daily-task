import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { generateEmployees } from "../Data/employees";

const INITIAL_VISIBLE_COUNT = 50;

const EmployeeRow = memo(function EmployeeRow({
  employee,
  isSelected,
  onSelect,
}) {
  return (
    <div
      className={isSelected ? "employee-row employee-row--selected" : "employee-row"}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "12px",
        padding: "8px 12px",
        borderBottom: "1px solid var(--border-color, #e5e7eb)",
        backgroundColor: isSelected
          ? "var(--selected-bg, #dbeafe)"
          : "transparent",
      }}
    >
      <span style={{ overflowWrap: "anywhere" }}>
        <strong>#{employee.id}</strong> — {employee.name} ({employee.dept}) — ₹
        {employee.salary.toLocaleString("en-IN")}
      </span>
      <button
        type="button"
        onClick={() => onSelect(employee.id)}
        style={{
          flexShrink: 0,
          padding: "4px 10px",
          borderRadius: "4px",
          border: "1px solid #6b7280",
          cursor: "pointer",
        }}
      >
        {isSelected ? "Selected" : "Select"}
      </button>
    </div>
  );
});

function DeptStats({ stats, darkMode }) {
  return (
    <section style={{ margin: "16px 0" }}>
      <h3>Empolyee Dashboard </h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: "10px",
        }}
      >
        {Object.entries(stats.byDept).map(([dept, info]) => (
          <div
            key={dept}
            style={{
              minWidth: 0,
              overflow: "hidden",
              padding: "10px 12px",
              borderRadius: "6px",
              border: darkMode ? "1px solid #374151" : "1px solid #d1d5db",
              backgroundColor: darkMode ? "#1f2937" : "#f9fafb",
            }}
          >
            <div
              style={{
                fontWeight: 600,
                fontSize: "0.75rem",
                overflowWrap: "anywhere",
                wordBreak: "break-word",
                marginBottom: "4px",
              }}
            >
              {dept}
            </div>
            <div>Headcount: {info.count}</div>
            <div>
              Avg Salary: ₹{Math.round(info.avgSalary).toLocaleString("en-IN")}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function EmployeeList({ employees, selectedId, onSelect, darkMode }) {
  return (
    <section
      style={{
        maxHeight: "420px",
        overflowY: "auto",
        border: darkMode ? "1px solid #374151" : "1px solid #d1d5db",
        borderRadius: "6px",
      }}
    >
      {employees.map((employee) => (
        <EmployeeRow
          key={employee.id}
          employee={employee}
          isSelected={employee.id === selectedId}
          onSelect={onSelect}
        />
      ))}
    </section>
  );
}

export function EmployeeDirectory({
  employees: propEmployees,
  selectedId: propSelectedId,
  onSelectEmployee,
  darkMode: propDarkMode,
  onToggleDarkMode: propToggleDarkMode,
}) {
  const [fallbackEmployees] = useState(() => generateEmployees(5000));
  const [fallbackSelectedId, setFallbackSelectedId] = useState(null);
  const [fallbackDarkMode, setFallbackDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

  const employees = propEmployees ?? fallbackEmployees;
  const selectedId =
    propSelectedId !== undefined ? propSelectedId : fallbackSelectedId;
  const darkMode = propDarkMode !== undefined ? propDarkMode : fallbackDarkMode;

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  }, [searchQuery]);

  const toggleDarkMode = useCallback(() => {
    if (propToggleDarkMode) {
      propToggleDarkMode();
    } else {
      setFallbackDarkMode((prev) => !prev);
    }
  }, [propToggleDarkMode]);

  const filteredEmployees = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return employees;

    return employees.filter(
      (emp) =>
        emp.name.toLowerCase().includes(q) ||
        emp.dept.toLowerCase().includes(q) ||
        String(emp.id).includes(q)
    );
  }, [employees, searchQuery]);

  const visibleEmployees = useMemo(
    () => filteredEmployees.slice(0, visibleCount),
    [filteredEmployees, visibleCount]
  );

  const stats = useMemo(() => {
    const uniqueDepartments = new Set(
      filteredEmployees.map((emp) => emp.dept)
    );

    const grouped = filteredEmployees.reduce((acc, emp) => {
      if (!acc[emp.dept]) {
        acc[emp.dept] = { count: 0, totalSalary: 0 };
      }
      acc[emp.dept].count += 1;
      acc[emp.dept].totalSalary += emp.salary;
      return acc;
    }, {});

    const byDept = Object.fromEntries(
      Object.entries(grouped).map(([dept, { count, totalSalary }]) => [
        dept,
        {
          count,
          avgSalary: count > 0 ? totalSalary / count : 0,
        },
      ])
    );

    return { uniqueDepartments, byDept };
  }, [filteredEmployees]);

  const handleSelect = useCallback(
    (id) => {
      if (onSelectEmployee) {
        onSelectEmployee(id);
      } else {
        setFallbackSelectedId((prev) => (prev === id ? null : id));
      }
    },
    [onSelectEmployee]
  );

  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => prev + INITIAL_VISIBLE_COUNT);
  }, []);

  return (
    <div
      style={{
        "--border-color": darkMode ? "#374151" : "#e5e7eb",
        "--selected-bg": darkMode ? "#1e3a8a" : "#dbeafe",
        backgroundColor: darkMode ? "#111827" : "#ffffff",
        color: darkMode ? "#f9fafb" : "#111827",
        padding: "16px",
        borderRadius: "8px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, dept, or ID..."
          aria-label="Search employees"
          style={{
            padding: "8px 12px",
            borderRadius: "6px",
            border: darkMode ? "1px solid #4b5563" : "1px solid #d1d5db",
            backgroundColor: darkMode ? "#1f2937" : "#ffffff",
            color: darkMode ? "#f9fafb" : "#111827",
            minWidth: "240px",
          }}
        />
        <button
          type="button"
          onClick={toggleDarkMode}
          aria-pressed={darkMode}
          style={{
            backgroundColor: darkMode ? "#f9fafb" : "#111827",
            color: darkMode ? "#111827" : "#f9fafb",
            border: "none",
            padding: "8px 14px",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          {darkMode ? "Light mode" : "Dark mode"}
        </button>
      </div>
      <DeptStats stats={stats} darkMode={darkMode} />
      <p style={{ marginBottom: "8px" }}>
        Showing <strong>{visibleEmployees.length}</strong> of{" "}
        <strong>{filteredEmployees.length}</strong> matching employees (
        {employees.length} total)
      </p>
      <EmployeeList
        employees={visibleEmployees}
        selectedId={selectedId}
        onSelect={handleSelect}
        darkMode={darkMode}
      />
      {visibleCount < filteredEmployees.length && (
        <div style={{ marginTop: "12px", textAlign: "center" }}>
          <button
            type="button"
            onClick={handleLoadMore}
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border: "1px solid #6b7280",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Load more
        </button>
        </div>
      )}
    </div>
  );
}

export default EmployeeDirectory;