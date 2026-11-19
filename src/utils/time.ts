// Константы для отображения
export const PICKUP_START = "08:00";
export const PICKUP_END = "20:00";
export const DELIVERY_START = "09:00";
export const DELIVERY_END = "20:00";
export const ORDER_CUTOFF_HOUR = 17; // После 17:00 заказы на сегодня закрыты
export const KITCHEN_CLOSE_HOUR = 18; // Кухня работает до 18:00

/**
 * Проверка: можно ли ещё заказать на сегодня
 */
export const canOrderToday = (): boolean => {
    const now = new Date();
    return now.getHours() < ORDER_CUTOFF_HOUR;
};

/**
 * Список доступных дат.
 * Если сейчас >= 17:00 — "сегодня" исключается.
 */
export const getAvailableDates = (): { value: string; label: string }[] => {
    const dates: { value: string; label: string }[] = [];
    const now = new Date();

    for (let i = 0; i < 7; i++) {
        const d = new Date(now);
        d.setDate(d.getDate() + i);
        const dateStr = d.toISOString().split("T")[0];

        // Блокируем сегодня, если сейчас >= 17:00
        if (i === 0 && now.getHours() >= ORDER_CUTOFF_HOUR) continue;

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

/**
 * Проверка валидности времени самовывоза
 */
export const validatePickupTime = (time: string, dateStr: string): boolean => {
    if (!time) return false;
    const intervals = getPickupTimeIntervals(dateStr);
    return intervals.includes(time);
};

/**
 * Проверка валидности времени доставки
 */
export const validateDeliveryTime = (time: string, dateStr: string): boolean => {
    if (!time) return false;
    const intervals = getDeliveryTimeIntervals(dateStr);
    return intervals.includes(time);
};

/**
 * Интервалы для самовывоза: 08:00 – 20:00.
 * Если сегодня — старт не раньше (текущее время + 1 час), чтобы кухня успела.
 */
export const getPickupTimeIntervals = (dateStr: string): string[] => {
    const now = new Date();
    const selectedDate = new Date(dateStr);
    const isToday = selectedDate.toDateString() === now.toDateString();

    if (selectedDate < new Date(now.toDateString())) return [];

    const pickupStart = new Date(selectedDate);
    pickupStart.setHours(8, 0, 0, 0);
    const pickupEnd = new Date(selectedDate);
    pickupEnd.setHours(20, 0, 0, 0);

    let start = new Date(pickupStart);

    if (isToday) {
        // Минимум +1 час от текущего времени (кухня готовит, клиент доедет)
        const minTime = new Date(now.getTime() + 60 * 60 * 1000);
        start = minTime > pickupStart ? minTime : pickupStart;
        if (start.getMinutes() > 0) {
            start.setHours(start.getHours() + 1, 0, 0, 0);
        }
    }

    const intervals: string[] = [];
    let current = new Date(start);

    while (current < pickupEnd) {
        const end = new Date(current);
        end.setHours(end.getHours() + 1);
        const actualEnd = end > pickupEnd ? pickupEnd : end;

        const fmt = (d: Date) => `${d.getHours().toString().padStart(2, "0")}:00`;
        intervals.push(`${fmt(current)}–${fmt(actualEnd)}`);
        current = actualEnd;
    }

    return intervals;
};

/**
 * Интервалы для доставки: 09:00 – 20:00.
 * Если сегодня — старт не раньше (текущее время + 2 часа).
 */
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

        const fmt = (d: Date) => `${d.getHours().toString().padStart(2, "0")}:00`;
        intervals.push(`${fmt(current)}–${fmt(actualEnd)}`);
        current = actualEnd;
    }

    return intervals;
};