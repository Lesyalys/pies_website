import { useMemo } from "react";
import type { GroupedPie, PieSize } from "../../hooks/useMenu";
import { useCart } from "../../context/CartContext";

export interface SetDefinition {
    id: string;
    name: string;
    description: string;
    pieNames: string[];
    discount?: number;
}

interface Props {
    set: SetDefinition;
    allPies: GroupedPie[];
}

const getSizeHalfKg = (pie: GroupedPie): PieSize | null =>
    pie.sizes.find((s) => s.KG === 0.5) || null;

const getDefaultDecor = (size: PieSize) =>
    size.decorations.find((d) => d.is_default) ||
    size.decorations[0] ||
    null;

export const SetCard = ({ set, allPies }: Props) => {
    const { addToCart } = useCart();

    const items = useMemo(() => {
        return set.pieNames
            .map((name) => {
                const pie = allPies.find((p) => p.product_name === name);
                if (!pie) return null;
                const size = getSizeHalfKg(pie);
                if (!size) return null;
                const decor = getDefaultDecor(size);
                const price = size.price + (decor?.price_delta || 0);
                return { pie, size, decor, price };
            })
            .filter(Boolean) as {
                pie: GroupedPie;
                size: PieSize;
                decor: ReturnType<typeof getDefaultDecor>;
                price: number;
            }[];
    }, [set.pieNames, allPies]);

    const rawTotal = items.reduce((sum, i) => sum + i.price, 0);
    const discountAmount = set.discount
        ? Math.round((rawTotal * set.discount) / 100)
        : 0;
    const totalPrice = rawTotal - discountAmount;

    const handleAdd = () => {
        items.forEach(({ pie, size, decor, price }) => {
            addToCart(pie, size, decor, price);
        });
    };

    return (
        <div className="set-card">
            <div className="set-card__header">
                <h3 className="set-card__title">{set.name}</h3>
                {set.discount ? (
                    <span className="set-card__discount">−{set.discount}%</span>
                ) : null}
            </div>
            <p className="set-card__desc">{set.description}</p>

            <ul className="set-card__items">
                {items.map(({ pie, price, decor }) => (
                    <li key={pie.id} className="set-card__item">
                        <span>
                            {pie.product_name}
                            {decor?.name && (
                                <em className="set-card__decor"> · {decor.name}</em>
                            )}
                        </span>
                        <span>{price} ₽</span>
                    </li>
                ))}
            </ul>

            <div className="set-card__footer">
                <div>
                    {discountAmount > 0 && (
                        <span className="set-card__old-price">{rawTotal} ₽</span>
                    )}
                    <span className="set-card__price">{totalPrice} ₽</span>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={handleAdd}
                    disabled={items.length !== 3}
                >
                    В корзину
                </button>
            </div>
        </div>
    );
};