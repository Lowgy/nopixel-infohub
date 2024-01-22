import React, { useEffect, useState } from 'react';

// Use targetHour when CountdownTimer is implemented in other files
interface CountdownTimerProps {
  targetHour: number; // 1 for 1am, 13 for 1pm
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetHour }) => {
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    const calculateCountdown = () => {
      const currentTime = new Date();
      const targetTime = new Date(
        currentTime.getFullYear(),
        currentTime.getMonth(),
        currentTime.getDate(),
        targetHour,
        0,
        0,
        0
      );

      // If the target time is in the past for today, set it for tomorrow
      if (currentTime.getTime() > targetTime.getTime()) {
        targetTime.setDate(targetTime.getDate() + 1);
      }

      const timeDifference = targetTime.getTime() - currentTime.getTime();
      setCountdown(timeDifference);
    };

    calculateCountdown(); // Initial calculation
    const intervalId = setInterval(calculateCountdown, 1000); // Update every second

    return () => clearInterval(intervalId); // Cleanup only when the parent component unmounts
  }, [targetHour]);

  // Parse the time so that the hours, minutes, and seconds are formatted to their right numbers
  const formatTime = (time: number): string => {
    const hours = Math.floor(time / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);

    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${hours}:${formattedMinutes}:${formattedSeconds}`;
  };

  // If the countdown is null, display "N/A." Otherwise, display the formatted time
  return <p>{countdown !== null ? formatTime(countdown) : 'N/A'}</p>;
};

export default CountdownTimer;
