import { useState } from "react";
import { useMenu } from "../../hooks/useMenu";
import { SetCard, type SetDefinition } from "./SetCard";
import { SetBuilderModal } from "./SetBuilderModal";

const SETS: SetDefinition[] = [
    {
        id: "set_sweet",
        name: "Сладкий сет",
        description: "3 сладких мини-пирога по 0.5 кг",
        pieNames: ["Пирог с вишней", "Пирог с черникой", "Пирог «Нежность»"],
        discount: 5,
    },
    {
        id: "set_savory",
        name: "Сытный сет",
        description: "3 сытных мини-пирога по 0.5 кг",
        pieNames: ["Пирог с курицей и картофелем", "Пирог «Жульен»", "Пирог с сыром"],
        discount: 5,
    },
    {
        id: "set_berry",
        name: "Ягодный микс",
        description: "3 ягодных мини-пирога по 0.5 кг",
        pieNames: ["Пирог с брусникой", "Пирог с чёрной смородиной", "Пирог с клубникой"],
        discount: 5,
    },
    {
        id: "set_veg",
        name: "Овощной сет",
        description: "3 овощных мини-пирога по 0.5 кг",
        pieNames: ["Пирог с капустой", "Пирог с картофелем", "Пирог с капустой и яйцом"],
        discount: 5,
    },
];

export const SetsSection = () => {
    const { groupedPies, loading } = useMenu();
    const [builderOpen, setBuilderOpen] = useState(false);

    if (loading) return null;

    return (
        <section className="sets" id="sets">
            <div className="container">
                <div className="section-label">Сеты мини-пирогов</div>

                <div className="sets__header">
                    <h2 className="sets__title">Соберите коробку</h2>
                    <p className="sets__desc">
                        3 мини-пирога по 0.5 кг в одной коробке — идеально для семейного
                        чаепития или в подарок.
                    </p>
                </div>

                <div className="sets__grid">
                    {SETS.map((set) => (
                        <SetCard key={set.id} set={set} allPies={groupedPies} />
                    ))}

                    {/* Карточка конструктора */}
                    <div className="set-card set-card--builder">
                        <div className="set-card__header">
                            <h3 className="set-card__title">Свой сет</h3>
                        </div>
                        <p className="set-card__desc">
                            Соберите свою коробку из 3 мини-пирогов по 0.5 кг — на ваш вкус.
                        </p>
                        <div className="set-card__footer">
                            <button
                                className="btn btn-outline"
                                onClick={() => setBuilderOpen(true)}
                            >
                                Собрать свой сет
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <SetBuilderModal
                allPies={groupedPies}
                isOpen={builderOpen}
                onClose={() => setBuilderOpen(false)}
            />
        </section>
    );
};