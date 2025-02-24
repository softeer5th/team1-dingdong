import { useState, useEffect } from "react";

interface TimerHookReturnType {
  formattedTime: string;
  isRunning: boolean;
  isExpired: boolean;
  seconds: number;
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
}

export const useTimer = (initialMinutes: number): TimerHookReturnType => {
  const [seconds, setSeconds] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsRunning(false);
      setIsExpired(true);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, seconds]);

  const startTimer = () => {
    setIsRunning(true);
    setIsExpired(false);
  };

  const stopTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsExpired(false);
    setSeconds(initialMinutes * 60);
  };

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedTime = `${minutes}분 ${remainingSeconds
    .toString()
    .padStart(2, "0")}초`;

  return {
    formattedTime,
    isRunning,
    isExpired,
    seconds,
    startTimer,
    stopTimer,
    resetTimer,
  };
};
