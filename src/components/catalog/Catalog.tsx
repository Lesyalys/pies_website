import { useState, useMemo } from "react";
import { ProductCard } from "./ProductCard";
import type { Pie, SizeInfo, MenuData } from "../../types/menu";
import menuDataJson from "../../data/menu.json";

const menuData = menuDataJson as MenuData;
const pies: Pie[] = menuData.pies;
const sizes: Record<string, SizeInfo> = menuData.sizes;
const categories = menuData.dictionaries.categories;

export const Catalog = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  // Группируем данные для отображения
  const groupedPies = useMemo(() => {
    if (activeFilter !== "all") {
      return [
        {
          key: activeFilter,
          title: categories[activeFilter] || activeFilter,
          items: pies.filter((pie) => pie.category === activeFilter),
        },
      ];
    }

    // Если "Все", то создаем массив групп по порядку словаря категорий
    return Object.entries(categories)
      .map(([key, label]) => ({
        key,
        title: label,
        items: pies.filter((pie) => pie.category === key),
      }))
      .filter((group) => group.items.length > 0); // Скрываем пустые группы
  }, [activeFilter]);

  return (
    <section id="catalog" className="catalog">
      <div className="container">
        <div className="section-label">В нашей витрине</div>

        <div className="catalog__header">
          <h2 className="catalog__title">Выберите свой пирог</h2>
          <p className="catalog__desc">
            Все пироги готовятся на слоёно-песочном тесте. Выберите подходящий
            вес.
          </p>
        </div>

        <div className="catalog__filters">
          <button
            onClick={() => setActiveFilter("all")}
            className={`btn ${activeFilter === "all" ? "btn-primary" : "btn-outline"}`}
            style={{ padding: "10px 24px", fontSize: "14px" }}
          >
            Все пироги
          </button>
          {Object.entries(categories).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={`btn ${activeFilter === key ? "btn-primary" : "btn-outline"}`}
              style={{ padding: "10px 24px", fontSize: "14px" }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Рендерим группы */}
        <div className="catalog__groups">
          {groupedPies.map((group) => (
            <div key={group.key} className="catalog__group">
              {/* Заголовок группы (появляется только если мы показываем несколько групп) */}
              {activeFilter === "all" && (
                <h3 className="catalog__group-title">{group.title}</h3>
              )}
              <div className="catalog__grid">
                {group.items.map((pie) => (
                  <ProductCard key={pie.id} pie={pie} sizes={sizes} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
