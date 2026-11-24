export interface SizeInfo {
  kg: number;
  diameter_cm_min: number;
  diameter_cm_max: number;
  persons_min: number;
  persons_max: number;
  label: string;
}

export interface Pie {
  id: string;
  category: string;
  name: string;
  image_url: string;
  image_url_cream?: string;
  image_url_sour_cream?: string;
  dough: string;
  ingredients: string[];
  price_per_kg: number;
  available_sizes: string[];
  decore: string[];
  is_stop: boolean;
  stop_start: string | null;
  stop_end: string | null;
  stop_reason: string | null;
}

export interface MenuData {
  meta?: Record<string, unknown>;
  dictionaries: {
    dough_types: Record<string, string>;
    categories: Record<string, string>;
  };
  sizes: Record<string, SizeInfo>;
  pies: Pie[];
}
