export const SETTINGS = {
  workingHours: {
    pickup: { start: "08:00", end: "20:00" },
    delivery: { start: "09:00", end: "20:00" },
  },
  deadlineHour: 18,
  pickupDiscount: 0.10,
  deliveryPrice: 150,

  // Активный ивент. Можно брать из env или CMS.
  eventStyle: "default" | "christmas" | "newyear" | "halloween",
};