"use client";

import { useSearchParams } from "next/navigation";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import ProductCard from "./ProductCard";

export default function ProductGrid() {
  const searchParams = useSearchParams();

  const category = searchParams.get("category");
  const size = searchParams.get("size");
  const color = searchParams.get("color");
  const priceRange = searchParams.get("price-range");
  const sort = searchParams.get("sort") || "featured";

  // Filtering Logic
  let filteredProducts = [...MOCK_PRODUCTS];

  if (category && category !== "all") {
    filteredProducts = filteredProducts.filter(p => p.category === category);
  }
  if (size && size !== "all") {
    filteredProducts = filteredProducts.filter(p => p.size.toLowerCase() === size.toLowerCase());
  }
  if (color && color !== "all") {
    filteredProducts = filteredProducts.filter(p => p.color.toLowerCase() === color.toLowerCase());
  }
  if (priceRange && priceRange !== "all") {
    filteredProducts = filteredProducts.filter(p => {
      if (priceRange === "$0 - $100") return p.price <= 100;
      if (priceRange === "$100 - $300") return p.price > 100 && p.price <= 300;
      if (priceRange === "$300 - $500") return p.price > 300 && p.price <= 500;
      if (priceRange === "$500+") return p.price > 500;
      return true;
    });
  }

  // Sorting Logic
  filteredProducts.sort((a, b) => {
    if (sort === "price-low") return a.price - b.price;
    if (sort === "price-high") return b.price - a.price;
    if (sort === "featured") {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
    }
    return 0;
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 py-8 min-h-[400px]">
      {filteredProducts.length > 0 ? (
        filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))
      ) : (
        <div className="col-span-full flex flex-col items-center justify-center py-20 text-zinc-400">
          <p className="text-sm font-medium">No items found matching these filters.</p>
        </div>
      )}
    </div>
  );
}
