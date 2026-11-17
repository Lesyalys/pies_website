export const Reviews = () => {
  const reviews = [
    {
      name: "Анна",
      date: "12 мая",
      text: "Заказывали пирог с вишней на день рождения. Это просто нечто! Тесто рассыпчатое, начинки очень много, и не приторно сладко. Гости были в восторге.",
    },
    {
      name: "Дмитрий",
      date: "5 мая",
      text: "Лучшая Пироговая в Москве. Брали ассорти мини-пирогов, чтобы угостить коллег. Привезли вовремя, в красивой коробке, всё было ещё тёплым.",
    },
    {
      name: "Елена",
      date: "28 апреля",
      text: "Пирог с грушей и горгонзолой — это гастрономический шедевр. Идеальное сочетание сладкого и соленого. Обязательно закажем еще!",
    },
  ];

  return (
    <section className="reviews">
      <div className="container">
        <div className="section-label">Отзывы</div>
        <h2 className="reviews__title">Нам доверяют</h2>

        <div className="reviews__grid">
          {reviews.map((r, i) => (
            <div key={i} className="review-card">
              <div className="review-card__header">
                <div className="review-card__name">{r.name}</div>
                <div className="review-card__date">{r.date}</div>
              </div>
              <p className="review-card__text">«{r.text}»</p>
              <div className="review-card__stars">★★★★★</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
