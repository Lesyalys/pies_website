import { useMemo, useState } from "react";
import type { GroupedPie, PieSize } from "../../hooks/useMenu";
import { useCart } from "../../context/CartContext";

interface Props {
    allPies: GroupedPie[];
    isOpen: boolean;
    onClose: () => void;
}

const getSizeHalfKg = (pie: GroupedPie): PieSize | null =>
    pie.sizes.find((s) => s.KG === 0.5) || null;

export const SetBuilderModal = ({ allPies, isOpen, onClose }: Props) => {
    const { addToCart } = useCart();

    // Доступные пироги для сета (0.5 кг и не осетинские)
    const availablePies = useMemo(
        () =>
            allPies.filter(
                (p) => p.category !== "Осетинские" && !!getSizeHalfKg(p)
            ),
        [allPies]
    );

    // Выбранные пироги (по id), максимум 3
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const togglePie = (id: string) => {
        setSelectedIds((prev) => {
            if (prev.includes(id)) return prev.filter((x) => x !== id);
            if (prev.length >= 3) return prev;
            return [...prev, id];
        });
    };

    const selectedItems = selectedIds
        .map((id) => availablePies.find((p) => p.id === id))
        .filter(Boolean) as GroupedPie[];

    const totalPrice = selectedItems.reduce((sum, pie) => {
        const size = getSizeHalfKg(pie);
        if (!size) return sum;
        const decor =
            size.decorations.find((d) => d.is_default) ||
            size.decorations[0] ||
            null;
        return sum + size.price + (decor?.price_delta || 0);
    }, 0);

    const handleAdd = () => {
        if (selectedIds.length !== 3) return;
        selectedItems.forEach((pie) => {
            const size = getSizeHalfKg(pie)!;
            const decor =
                size.decorations.find((d) => d.is_default) ||
                size.decorations[0] ||
                null;
            const price = size.price + (decor?.price_delta || 0);
            addToCart(pie, size, decor, price);
        });
        setSelectedIds([]);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="set-builder-overlay">
            <div className="set-builder">
                <button className="set-builder__close" onClick={onClose} aria-label="Закрыть">
                    ×
                </button>

                <h2 className="set-builder__title">Соберите свой сет</h2>
                <p className="set-builder__subtitle">
                    Выберите 3 мини-пирога по 0.5 кг — мы упакуем их в одну коробку.
                </p>

                <div className="set-builder__progress">
                    Выбрано: {selectedIds.length} / 3
                </div>

                <div className="set-builder__list">
                    {availablePies.map((pie) => {
                        const selected = selectedIds.includes(pie.id);
                        const size = getSizeHalfKg(pie);
                        if (!size) return null;
                        const decor =
                            size.decorations.find((d) => d.is_default) ||
                            size.decorations[0] ||
                            null;
                        const price = size.price + (decor?.price_delta || 0);
                        return (
                            <button
                                key={pie.id}
                                type="button"
                                className={`set-builder__item ${selected ? "active" : ""}`}
                                onClick={() => togglePie(pie.id)}
                                disabled={!selected && selectedIds.length >= 3}
                            >
                                <span className="set-builder__item-name">
                                    {pie.product_name}
                                </span>
                                <span className="set-builder__item-price">{price} ₽</span>
                            </button>
                        );
                    })}
                </div>

                <div className="set-builder__footer">
                    <div className="set-builder__total">
                        <span>Итого:</span>
                        <strong>{totalPrice} ₽</strong>
                    </div>
                    <button
                        className="btn btn-primary"
                        disabled={selectedIds.length !== 3}
                        onClick={handleAdd}
                    >
                        Добавить в корзину
                    </button>
                </div>
            </div>
        </div>
    );
};