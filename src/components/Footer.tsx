export const Footer = () => (
  <footer className="footer" id="contacts">
    <div className="container">
      <div className="footer__top">
        <div className="footer__brand">
          <div className="footer__logo">Домашние пироги</div>
          <p className="footer__desc">
            Домашние пироги ручной работы с доставкой по Сургуту
          </p>
        </div>

        <div>
          <div className="footer__col-label">Связаться</div>
          <div className="footer__phone">+7 495 123-45-67</div>
          <a href="mailto:hello@pirogovaya.ru" className="footer__email">
            hello@pirogovaya.ru
          </a>
        </div>

        <div>
          <div className="footer__col-label">Режим работы</div>
          <div className="footer__schedule">Ежедневно, 09:00–20:00</div>
          <div className="footer__schedule-muted">Работа кухни до 18:00</div>
        </div>
      </div>

      <div className="footer__bottom">
        <div>© 2026 Домашние пироги<br /> Все права защищены.</div>
        <div>Сделано с заботой о семейных вечерах</div>
      </div>
    </div>
  </footer>
);
