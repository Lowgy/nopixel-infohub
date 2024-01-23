import { useState, useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';

const serverTimeResets: Record<string, number[]> = {
  whitelist: [1, 13],
  public: [6, 14, 22],
};

interface UseTimeComparisonResult {
  userCurrentTime: Dayjs;
  closestTime: Dayjs | null;
}

const useTimeComparison = (server: string): UseTimeComparisonResult => {
  const [userCurrentTime, setUserCurrentTime] = useState(dayjs());
  const [closestTime, setClosestTime] = useState<Dayjs | null>(null);
  const [countdown, setCountdown] = useState<number | null>(0);
  const [targetTimes, setTargetTimes] = useState<number[]>(
    serverTimeResets[server]
  );

  useEffect(() => {
    const calculateClosestTime = () => {
      let closestTime = 0;
      let minTimeDiff = Math.abs(
        userCurrentTime.diff(
          dayjs(new Date().setHours(targetTimes[0], 0, 0, 0), 'HH:mm'),
          'minute'
        )
      );

      for (let i = 0; i < targetTimes.length; i++) {
        if (userCurrentTime.hour() >= targetTimes[i]) {
          const closestTimeObj = dayjs(
            new Date().setHours(targetTimes[i + 1], 0, 0, 0),
            'HH:mm'
          ).add(1, 'day');

          setClosestTime(closestTimeObj);

          const countdownMinutes = closestTimeObj.diff(
            userCurrentTime,
            'minute'
          );

          setCountdown(countdownMinutes);

          return;
        }
      }

      for (let i = 1; i < targetTimes.length; i++) {
        console.log(userCurrentTime.hour(), targetTimes[i]);
        let timeDiff = Math.abs(
          userCurrentTime.diff(
            userCurrentTime.diff(
              dayjs(new Date().setHours(targetTimes[0], 0, 0, 0), 'HH:mm'),
              'minute'
            )
          )
        );
        if (timeDiff < minTimeDiff) {
          minTimeDiff = timeDiff;
          closestTime = i;
        }
      }

      const closestTimeObj = dayjs(
        new Date().setHours(targetTimes[closestTime], 0, 0, 0),
        'HH:mm'
      );

      setClosestTime(closestTimeObj);
    };
    calculateClosestTime();
  }, [userCurrentTime, server]);

  return {
    closestTime,
    userCurrentTime,
  };
};

export default useTimeComparison;
