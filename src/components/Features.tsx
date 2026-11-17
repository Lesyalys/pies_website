export const Features = () => {
  const features = [
    {
      icon: "⏱",
      title: "В удобное время",
      subtitle: "С 8:00 до 20:00",
      desc: "Мы работаем без перерывов и выходных",
    },
    {
      icon: "✨",
      title: "Доставим легко",
      subtitle: "150 рублей",
      desc: "Бесплатная доставка от 2000 рублей",
    },
    {
      icon: "🚚",
      title: "Домашние пироги",
      subtitle: "Гарантия качества",
      desc: "Мы используем только свежие продукты",
    },
    {
      icon: "🚚",
      title: "С пылу с жару",
      subtitle: "С печи, и сразу к вам",
      desc: "Наши пироги всегда горячие",
    },
  ];

  return (
    <div className="features">
      <div className="container features__inner">
        {features.map((f, i) => (
          <div key={i} className="feature">
            <div className="feature__icon">{f.icon}</div>
            <div className="feature__text">
              <div className="feature__title">{f.title}</div>
              <div className="feature__subtitle">{f.subtitle}</div>
              <div className="feature__desc">{f.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
