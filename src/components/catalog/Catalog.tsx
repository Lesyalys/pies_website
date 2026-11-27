import { useMemo, useState } from "react";
import { ProductCard } from "./ProductCard";
import { useMenu } from "../../hooks/useMenu";

const CATEGORY_ORDER = ["Осетинские", "Сладкие", "Овощные", "Сытные"];

export const Catalog = () => {
  const { groupedPies, loading, error } = useMenu();
  const [activeFilter, setActiveFilter] = useState<string>("all");

  // Категории, которые реально есть в данных — сохраняем порядок CATEGORY_ORDER,
  // а те, что не попали в список, добавляем в конец.
  const availableCategories = useMemo(() => {
    const present = new Set(groupedPies.map((p) => p.category));
    const ordered = CATEGORY_ORDER.filter((c) => present.has(c));
    const extras = Array.from(present).filter((c) => !CATEGORY_ORDER.includes(c));
    return [...ordered, ...extras];
  }, [groupedPies]);

  // Что рендерить
  const groups = useMemo(() => {
    if (activeFilter === "all") {
      return availableCategories
        .map((cat) => ({
          key: cat,
          label: cat,
          items: groupedPies.filter((p) => p.category === cat),
        }))
        .filter((g) => g.items.length > 0);
    }
    return [
      {
        key: activeFilter,
        label: activeFilter,
        items: groupedPies.filter((p) => p.category === activeFilter),
      },
    ].filter((g) => g.items.length > 0);
  }, [groupedPies, activeFilter, availableCategories]);

  if (loading) {
    return (
      <section className="catalog">
        <div className="container">
          <div className="catalog__loading">Загружаем меню…</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="catalog">
        <div className="container">
          <div className="catalog__error">Не удалось загрузить меню: {error}</div>
        </div>
      </section>
    );
  }

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
          {availableCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`btn ${activeFilter === cat ? "btn-primary" : "btn-outline"}`}
              style={{ padding: "10px 24px", fontSize: "14px" }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="catalog__groups">
          {groups.map((group) => (
            <div key={group.key} className="catalog__group">
              {activeFilter === "all" && (
                <h3 className="catalog__group-title">{group.label}</h3>
              )}
              <div className="catalog__grid">
                {group.items.map((pie) => (
                  <ProductCard key={pie.id} pie={pie} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};