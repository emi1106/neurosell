import Image from 'next/image';
import { use } from 'react';

// Mock product data - in a real app, this would come from an API
const getProductData = (id: string) => {
  return {
    id,
    title: "Vintage Levi's Denim Jacket",
    price: 79.99,
    description: "Authentic vintage Levi's denim jacket from the 90s. Perfect condition with minimal wear. Classic straight fit with button closure. Made in USA. A timeless piece that never goes out of style.",
    category: "Jackets",
    brand: "Levi's",
    size: "M",
    condition: "Excellent",
    color: "Indigo Blue",
    material: "100% Cotton",
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    ],
    seller: {
      name: "FashionVintage",
      rating: 4.8,
      reviews: 127
    }
  };
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductPage({ params }: PageProps) {
  const { id } = use(params);
  const product = getProductData(id);

  const details = [
    { label: 'Category', value: product.category },
    { label: 'Brand', value: product.brand },
    { label: 'Size', value: product.size },
    { label: 'Condition', value: product.condition },
    { label: 'Color', value: product.color },
    { label: 'Material', value: product.material },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 pt-16 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

          {/* Product Images */}
          <div className="space-y-3">
            <div className="aspect-[3/4] bg-zinc-50 overflow-hidden">
              {product.images[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  width={800}
                  height={1000}
                  className="w-full h-full object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-300">
                  <p className="text-xs tracking-widest uppercase">No image</p>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((image, index) => (
                <div key={index} className="aspect-square bg-zinc-50 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                  <Image
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Information */}
          <div className="flex flex-col space-y-8 lg:pt-4">

            {/* Category badge */}
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400">
              {product.category}
            </p>

            {/* Title and Price */}
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-medium tracking-tighter text-zinc-900 leading-[0.9]">
                {product.title}
              </h1>
              <p className="text-2xl font-medium tracking-tight text-zinc-900">
                €{product.price.toFixed(2)}
              </p>
            </div>

            {/* Seller */}
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <span className="font-medium text-zinc-700">{product.seller.name}</span>
              <span className="text-zinc-300">·</span>
              <span>{product.seller.rating} ★</span>
              <span className="text-zinc-300">·</span>
              <span>{product.seller.reviews} reviews</span>
            </div>

            {/* Description */}
            <div className="border-t border-zinc-100 pt-6">
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400 mb-3">Description</p>
              <p className="text-sm text-zinc-600 leading-relaxed font-light">{product.description}</p>
            </div>

            {/* Details grid */}
            <div className="border-t border-zinc-100 pt-6">
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400 mb-4">Details</p>
              <dl className="grid grid-cols-2 gap-x-8 gap-y-4">
                {details.map(({ label, value }) => (
                  <div key={label}>
                    <dt className="text-[10px] font-bold tracking-[0.15em] uppercase text-zinc-400">{label}</dt>
                    <dd className="mt-0.5 text-sm font-medium text-zinc-900">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Action Buttons */}
            <div className="border-t border-zinc-100 pt-6 space-y-3">
              <button className="w-full h-12 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold tracking-[0.2em] uppercase transition-all hover:scale-[1.01] active:scale-[0.99]">
                Add to Cart
              </button>
              <button className="w-full h-12 border border-zinc-200 hover:border-zinc-900 text-zinc-700 hover:text-zinc-900 text-xs font-bold tracking-[0.2em] uppercase transition-all">
                Contact Seller
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}