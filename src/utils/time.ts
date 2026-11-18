export const PICKUP_START = "08:00";
export const PICKUP_END = "20:00";
export const DELIVERY_START = "09:00";
export const DELIVERY_END = "20:00";

/**
 * Проверка валидности времени самовывоза:
 * - в пределах 08:00–20:00
 * - если дата — сегодня, время не должно быть в прошлом
 */
export const validatePickupTime = (time: string, dateStr: string): boolean => {
    if (!time) return false;
    const [h, m] = time.split(":").map(Number);

    // Проверка диапазона
    if (h < 8 || h > 20) return false;
    if (h === 20 && m > 0) return false; // 20:00 — крайний срок

    // Проверка "не в прошлом" для сегодня
    const now = new Date();
    const selected = new Date(dateStr);
    if (selected.toDateString() === now.toDateString()) {
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        const selectedMinutes = h * 60 + m;
        if (selectedMinutes <= currentMinutes + 120) return false; // минимум +30 минут на сборку
    }

    return true;
};

/**
 * Проверка валидности времени доставки:
 * - должно совпадать с одним из доступных интервалов
 */
export const validateDeliveryTime = (time: string, dateStr: string): boolean => {
    if (!time) return false;
    const intervals = getDeliveryTimeIntervals(dateStr);
    return intervals.includes(time);
};

export const getAvailableDates = (): { value: string; label: string }[] => {
    const dates = [];
    const now = new Date();

    for (let i = 0; i < 7; i++) {
        const d = new Date(now);
        d.setDate(d.getDate() + i);
        const dateStr = d.toISOString().split("T")[0];

        // Блокируем "сегодня", если сейчас >= 18:00 (дедлайн)
        if (i === 0 && now.getHours() >= 18) continue;

        const label =
            i === 0
                ? "Сегодня"
                : i === 1
                    ? "Завтра"
                    : d.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });

        dates.push({ value: dateStr, label });
    }
    return dates;
};

export const getDeliveryTimeIntervals = (dateStr: string): string[] => {
    const now = new Date();
    const selectedDate = new Date(dateStr);
    const isToday = selectedDate.toDateString() === now.toDateString();

    if (selectedDate < new Date(now.toDateString())) return [];

    const deliveryStart = new Date(selectedDate);
    deliveryStart.setHours(9, 0, 0, 0);
    const deliveryEnd = new Date(selectedDate);
    deliveryEnd.setHours(20, 0, 0, 0);

    let start = new Date(deliveryStart);

    if (isToday) {
        const minTime = new Date(now.getTime() + 2 * 60 * 60 * 1000);
        start = minTime > deliveryStart ? minTime : deliveryStart;
        if (start.getMinutes() > 0) {
            start.setHours(start.getHours() + 1, 0, 0, 0);
        }
    }

    const intervals: string[] = [];
    let current = new Date(start);

    while (current < deliveryEnd) {
        const end = new Date(current);
        end.setHours(end.getHours() + 1);
        const actualEnd = end > deliveryEnd ? deliveryEnd : end;

        const formatTime = (d: Date) => {
            const h = d.getHours().toString().padStart(2, "0");
            return `${h}:00`;
        };

        intervals.push(`${formatTime(current)}–${formatTime(actualEnd)}`);
        current = actualEnd;
    }

    return intervals;
};