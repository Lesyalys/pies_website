import { useEffect, useState } from "react";
import { SETTINGS } from "../config/settings";

export const useOrderDeadline = () => {
  const [isTodayAvailable, setIsTodayAvailable] = useState(true);
  const [nextAvailableDate, setNextAvailableDate] = useState<Date>(new Date());

  useEffect(() => {
    const checkDeadline = () => {
      const now = new Date();
      const currentHour = now.getHours();

      // Если сейчас >= 18:00 — на сегодня уже нельзя, минимум на завтра
      if (currentHour >= SETTINGS.deadlineHour) {
        setIsTodayAvailable(false);
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        setNextAvailableDate(tomorrow);
      } else {
        setIsTodayAvailable(true);
        setNextAvailableDate(now);
      }
    };

    checkDeadline(); // Проверка при монтировании
    const interval = setInterval(checkDeadline, 60 * 1000); // Раз в минуту
    return () => clearInterval(interval);
  }, []);

  return { isTodayAvailable, nextAvailableDate };
};
