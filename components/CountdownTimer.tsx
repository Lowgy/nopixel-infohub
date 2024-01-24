import React, { useEffect, useState } from 'react';

interface CountdownTimerProps {
  targetHour: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetHour }) => {
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    const calculateCountdown = () => {
      // Get the user's current time
      const currentTime = new Date();

      // Get the user's timezone offset in minutes
      const userTimezoneOffset = currentTime.getTimezoneOffset();

      // Convert the offset to hours
      const userTimezoneOffsetHours = userTimezoneOffset / 60;

      // Convert to CST (Central Standard Time)
      const cstOffset = -6; // CST offset is UTC-6

      // Calculate the user's time in CST
      const currentTimeInCST = new Date(currentTime.getTime() + (userTimezoneOffsetHours + cstOffset) * 60 * 60 * 1000);

      // Incorporate the CST time to the targetTime
      const targetTime = new Date(
        currentTimeInCST.getFullYear(),
        currentTimeInCST.getMonth(),
        currentTimeInCST.getDate(),
        targetHour,
        0,
        0,
        0
      );

      // If the target time is in the past for today, set it for tomorrow
      if (currentTimeInCST.getTime() > targetTime.getTime()) {
        targetTime.setDate(targetTime.getDate() + 1);
      }

      const timeDifference = targetTime.getTime() - currentTimeInCST.getTime();
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
