export interface Decoration {
  id: number;
  name: string;
  image_url: string;
  price_delta: number;
  is_default: boolean;
}

export interface Pie {
  id: string;               // уникальный ключ — генерим из product_name + KG
  product_name: string;
  KG: number;
  price: number;
  ingredients: string[];
  decorations: Decoration[];
}