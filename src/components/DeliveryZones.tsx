import { Map } from "./Map";

const ZONES = [
  { name: "Город", price: 200, color: "#6B1D2A" },
  { name: "Удалённые районы", price: 300, color: "#B8962C" },
  { name: "За городом", price: 400, color: "#4A5D23" },
];

export const DeliveryZones = () => {
  return (
    <section className="delivery-zones" id="delivery">
      <div className="container">
        <div className="section-label">Зоны доставки</div>

        <div className="delivery-zones__header">
          <h2 className="delivery-zones__title">Куда мы доставляем</h2>
          <p className="delivery-zones__desc">
            Проверьте на карте, входит ли ваш адрес в зону доставки. Если улицы
            нет на карте — свяжитесь с нами для уточнения.
          </p>
        </div>

        <div className="delivery-zones__content">
          {/* Карта */}
          <div className="delivery-zones__map">
            <Map />
          </div>

          {/* Описание зон */}
          <div className="delivery-zones__info">
            <h3 className="delivery-zones__info-title">Стоимость доставки</h3>

            <ul className="delivery-zones__list">
              {ZONES.map((zone) => (
                <li key={zone.name} className="delivery-zones__item">
                  <span
                    className="delivery-zones__dot"
                    style={{ backgroundColor: zone.color }}
                  />
                  <span className="delivery-zones__name">{zone.name}</span>
                  <span className="delivery-zones__price">{zone.price} ₽</span>
                </li>
              ))}
            </ul>

            <div className="delivery-zones__note">
              <p>
                ⏰ Доставка работает ежедневно с <strong>9:00 до 20:00</strong>.
              </p>
              <p>
                📞 Если не нашли свой район на карте, позвоните нам — мы обсудим
                возможность доставки.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
