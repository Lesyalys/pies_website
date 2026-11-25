export const CustomOrder = () => (
  <section className="custom-order" id="about">
    <div className="custom-order__image"></div>
    <div className="custom-order__content">
      <div className="custom-order__label">О нас</div>
      <h2 className="custom-order__title">
        Мы — лучшие
        <br />
        в своём деле,
        <br />и это не преувеличение
      </h2>
      <p className="custom-order__desc">
        Это — отзывы наших клиентов. Вот уже более пяти лет мы с любовью печём
        пироги для наших клиентов. Всегда свежие, сытные и вкусные! Наши пироги
        украсят ваш стол и удивят гостей неповторимым вкусом.
      </p>
      <div className="custom-order__stats">
        <div>
          <div className="custom-order__stat-val">5+</div>
          <div className="custom-order__stat-label">лет опыта</div>
        </div>
        <div>
          <div className="custom-order__stat-val">100%</div>
          <div className="custom-order__stat-label">свежая выпечка</div>
        </div>
        <div>
          <div className="custom-order__stat-val">1000+</div>
          <div className="custom-order__stat-label">довольных клиентов</div>
        </div>
      </div>
      <button className="btn btn-light btn-arrow">Выбрать пирог</button>
    </div>
  </section>
);
