# 🥧 Домашние пироги — интернет-магазин домашних пирогов

Фронтенд-магазин домашней выпечки: каталог с фильтрами, корзина, оформление заказа (доставка/самовывоз), проверка временных слотов, праздничные темы.

## Стек

Vite · React 18 · TypeScript · React Context · CSS-переменные · Google Fonts. Без UI-библиотек.

## Функционал

- **Каталог**: группировка по категориям, фильтрация, выбор веса (0.8–3 кг), динамический расчёт цены/диаметра/порций, стоп-листы, заглушки изображений.
- **Корзина**: боковая панель, изменение количества, удаление, рекомендации, сводка, состояние в контексте.
- **Оформление**: доставка (150 ₽) или самовывоз (−10%), дата до 7 дней, раздельные интервалы (доставка 09:00–20:00, самовывоз 08:00–20:00 с учётом времени на готовку), дедлайн «на сегодня» — 17:00, маска телефона, адрес, итоговая карточка, валидация.

## Запуск

```bash
npm install
npm run dev   # http://localhost:5173
```

Требуется Node.js 18+.

## Структура

```
src/
├── components/   # TopBar, Header, Hero, Features, Catalog, ProductCard,
│                 # CartDrawer, CheckoutModal, AddressInput, CustomOrder,
│                 # Reviews, CTA, Footer
├── config/       # settings.ts — часы, скидки, цены, тема
├── context/      # CartContext.tsx
├── data/         # menu.json, hero.json
├── styles/       # global.css, components.css, events.css
├── types/        # menu.ts
├── utils/        # time.ts — даты и интервалы
├── App.tsx
└── main.tsx
```

## Настройка

Ключевые параметры — в `src/config/settings.ts`:

```ts
workingHours: { pickup: {08:00–20:00}, delivery: {09:00–20:00} },
orderCutoffHour: 17,
kitchenCloseHour: 18,
pickupDiscount: 0.10,
deliveryPrice: 150,
eventStyle: "default" // "christmas" | "newyear" | "halloween"
```

Каталог — `src/data/menu.json` (тип `Pie`: id, category, name, image_url, dough, ingredients, price_per_kg, available_sizes, is_stop, stop_start/end/reason). Цена = `price_per_kg × вес`.

## Праздничные темы

1. Задать `eventStyle` в `settings.ts`.
2. В `main.tsx` повесить класс `event-<style>` на `<body>`.
3. В `events.css` переопределить CSS-переменные (`--color-primary`, `--color-bg-main` и т.д.).

Новый праздник = новое значение `eventStyle` + блок `.event-<name>` в `events.css`.

## Логика заказов

- Заказы «на сегодня» — до 17:00; после — только на завтра (кухня до 18:00).
- **Доставка**: 09:00–20:00, сегодня — не раньше `сейчас + 2 ч` (округление вверх).
- **Самовывоз**: 08:00–20:00, сегодня — не раньше `сейчас + 1 ч`.
- Валидация: телефон 11 цифр `+7 (___) ___-__-__`, улица и дом (для доставки), время из доступных интервалов; кнопка блокируется при ошибках.

## Сборка

```bash
npm run build      # dist/
npm run preview
npx tsc --noEmit   # проверка типов
npm run lint       # если настроен ESLint
```
