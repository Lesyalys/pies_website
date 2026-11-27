import { useEffect, useState } from "react";
import { supabase, getProductImageUrl } from "../lib/supabase";
import type { Decoration } from "../types/menu";

export interface PieSize {
    id: string;
    KG: number;
    price: number;
    decorations: Decoration[];
}

export interface GroupedPie {
    id: string;
    product_name: string;
    category: string;
    ingredients: string[];
    image_url: string;   // ← базовая картинка пирога
    sizes: PieSize[];
}

interface RawRow {
    product_name: string;
    category: string | null;
    KG: number;
    price: number;
    ingredients: string[] | null;
    decorations: Decoration[] | null;
    image_url: string | null;   // ← новое
}

const mapDecorations = (raw: Decoration[] | null): Decoration[] => {
    if (!raw) return [];
    return raw.map((d) => ({
        ...d,
        image_url: getProductImageUrl(d.image_url),
    }));
};

export const useMenu = () => {
    const [groupedPies, setGroupedPies] = useState<GroupedPie[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMenu = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from("PRODUCT_CARD")
                .select(
                    "product_name, category, KG, price, ingredients, decorations, image_url"
                );

            if (error) {
                setError(error.message);
                setLoading(false);
                return;
            }

            const rows = (data || []) as RawRow[];
            const map = new Map<string, GroupedPie>();

            for (const row of rows) {
                const key = row.product_name;
                const size: PieSize = {
                    id: `${row.product_name}__${row.KG}`.replace(/\s+/g, "_"),
                    KG: row.KG,
                    price: Number(row.price),
                    decorations: mapDecorations(row.decorations),
                };

                if (!map.has(key)) {
                    map.set(key, {
                        id: key.replace(/\s+/g, "_"),
                        product_name: row.product_name,
                        category: row.category || "Другое",
                        ingredients: row.ingredients || [],
                        image_url: row.image_url ? getProductImageUrl(row.image_url) : "",
                        sizes: [size],
                    });
                } else {
                    map.get(key)!.sizes.push(size);
                }
            }

            const grouped = Array.from(map.values()).map((pie) => ({
                ...pie,
                sizes: pie.sizes.sort((a, b) => a.KG - b.KG),
            }));

            setGroupedPies(grouped);
            setLoading(false);
        };

        fetchMenu();
    }, []);

    return { groupedPies, loading, error };
};