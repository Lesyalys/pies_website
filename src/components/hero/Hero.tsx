import { useState, useEffect } from "react";
import heroData from "../../data/hero.json";

interface SlideData {
  id: number;
  titleFirst: string;
  titleSecond: string;
  mainImage: string;
  buttonText?: string;
}

const slides = heroData.slides as SlideData[];

export const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const nextSlide = () => {
    setDirection("next");
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setDirection("prev");
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const slide = slides[currentSlide];

  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-new" key={`slide-${slide.id}`}>
          {/* Фоновое изображение с анимацией перелистывания */}
          <div
            className={`hero-new__bg hero-new__bg--${direction}`}
            style={{ backgroundImage: `url(${slide.mainImage})` }}
          >
            <div className="hero-new__overlay" />
          </div>

          {/* Контент поверх фона с анимацией перелистывания */}
          <div className="hero-new__inner">
            <div
              className={`hero-new__content hero-new__content--${direction}`}
            >
              <h1 className="hero-new__title">
                {slide.titleFirst}
                <br />
                <span>{slide.titleSecond}</span>
              </h1>
              <button className="btn btn-primary btn-arrow hero-new__btn">
                {slide.buttonText || "Выбрать пирог"}
              </button>
            </div>
          </div>

          {/* Стрелки навигации */}
          <button
            className="hero-new__arrow hero-new__arrow--prev"
            onClick={prevSlide}
            aria-label="Предыдущий слайд"
          >
            ‹
          </button>
          <button
            className="hero-new__arrow hero-new__arrow--next"
            onClick={nextSlide}
            aria-label="Следующий слайд"
          >
            ›
          </button>

          {/* Пагинация */}
          <div className="hero-new__nav">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`hero-new__dot ${index === currentSlide ? "active" : ""}`}
                onClick={() => {
                  setDirection(index > currentSlide ? "next" : "prev");
                  setCurrentSlide(index);
                }}
                aria-label={`Перейти к слайду ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
