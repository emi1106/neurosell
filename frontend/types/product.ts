export interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  description: string;
  category: "shoe" | "tshirt" | "jacket" | "hoodie" | "bottom" | "accessory" | "knitwear" | "outerwear" | "shirts" | "leather goods";
  subCategory?: string; // e.g. "Desert Sand / Virgin Wool"
  size: string;
  color: string;
  brand: string;
  condition: "new" | "like new" | "used" | "vintage";
  isFeatured?: boolean;
}
