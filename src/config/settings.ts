export const SETTINGS = {
  // График работы
  workingHours: {
    pickup: { start: "08:00", end: "20:00" },
    delivery: { start: "09:00", end: "20:00" },
  },
  // Дедлайн приема заказов на сегодня
  deadlineHour: 18, // 18:00 — после этого только на завтра
  // Скидка за самовывоз
  pickupDiscount: 0.1, // 10%
  // Тарифы доставки
  deliveryZones: [
    { id: "zhd", name: "ЖД", price: 200 },
    { id: "prom", name: "Промышленные районы", price: 200 },
    { id: "gres", name: "ГРЭС, Финский, Кедровый", price: 250 },
    { id: "white_yar", name: "Белый Яр, Юность, Снежный", price: 300 },
    {
      id: "airport",
      name: "Аэропорт, Дорожный, Таежный, Солнечный, Барсово",
      price: 350,
    },
    { id: "promzona", name: "Солнечная Промзона, ЗСК", price: 500 },
  ],
};
