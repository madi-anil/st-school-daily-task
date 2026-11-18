import { useState, useRef, useEffect } from "react";
import "./PomodoroTimer.css";

function PomodoroTimer() {
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);

  const focusDuration = focusMinutes * 60;
  const breakDuration = breakMinutes * 60;

  const [seconds, setSeconds] = useState(() => focusMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);

  const [mode, setMode] = useState("Focus");
  const modeRef = useRef("Focus");
  const [completedSessions, setCompletedSessions] = useState(0);

  const intervalRef = useRef(null);
  const endTimeRef = useRef(null);

  const formattedTime = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  const completeFocusSession = () => {
    setCompletedSessions((count) => count + 1);
  };

  const startTimer = (duration) => {
    if (intervalRef.current !== null) return;

    endTimeRef.current = Date.now() + duration * 1000;
    setIsRunning(true);

    intervalRef.current = setInterval(() => {
      const remaining = Math.ceil((endTimeRef.current - Date.now()) / 1000);

      if (remaining <= 0) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        endTimeRef.current = null;

        if (modeRef.current === "Focus") {
          completeFocusSession();
        }

        switchMode(true);
        return;
      }

      setSeconds(remaining);
    }, 250);
  };

  const pauseTimer = () => {
    const remaining = Math.max(
      0,
      Math.ceil((endTimeRef.current - Date.now()) / 1000),
    );

    clearInterval(intervalRef.current);
    intervalRef.current = null;
    endTimeRef.current = null;

    setSeconds(remaining);
    setIsRunning(false);
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    endTimeRef.current = null;

    setIsRunning(false);

    setSeconds(modeRef.current === "Focus" ? focusDuration : breakDuration);
  };

  const switchMode = (automatic = false) => {
    const currentMode = modeRef.current;
    const nextMode = currentMode === "Focus" ? "Break" : "Focus";

    const nextDuration = nextMode === "Focus" ? focusDuration : breakDuration;

    clearInterval(intervalRef.current);
    intervalRef.current = null;
    endTimeRef.current = null;

    modeRef.current = nextMode;
    setMode(nextMode);
    setSeconds(nextDuration);

    if (automatic) {
      startTimer(nextDuration);
    } else {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
      document.title = "Pomodoro Timer";
    };
  }, []);

  useEffect(() => {
    if (isRunning) {
      document.title = `${formattedTime} - ${mode} | Pomodoro`;
    } else {
      document.title = "Pomodoro Timer";
    }
  }, [formattedTime, isRunning, mode]);

  return (
    <div className="pomodoro-container">
      <h2>Pomodoro Timer</h2>

      <p className="pomodoro-mode">{mode} Time</p>

      <h1 className="pomodoro-timer">{formattedTime}</h1>

      <div className="pomodoro-settings">
        <div>
          <label>Focus Minutes</label>
          <input
            type="number"
            min="1"
            max="60"
            value={focusMinutes}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (value >= 1 && value <= 60) {
                setFocusMinutes(value);
              }
            }}
          />
        </div>

        <div>
          <label>Break Minutes</label>
          <input
            type="number"
            min="1"
            max="60"
            value={breakMinutes}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (value >= 1 && value <= 60) {
                setBreakMinutes(value);
              }
            }}
          />
        </div>
      </div>

      <p className="pomodoro-sessions">
        Completed Sessions: {completedSessions}
      </p>

      <div className="pomodoro-buttons">
        <button onClick={() => startTimer(seconds)} disabled={isRunning}>
          Start ▶️
        </button>

        <button onClick={pauseTimer} disabled={!isRunning}>
          Pause ⏸️
        </button>

        <button className="pomodoro-reset-button" onClick={resetTimer}>
          Reset 🔄️
        </button>
      </div>
    </div>
  );
}

export default PomodoroTimer;