import Image from 'next/image';
import { use } from 'react';
import { MOCK_PRODUCTS } from '@/lib/mock-data';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductPage({ params }: PageProps) {
  const { id } = use(params);
  
  // Find product by id in mock data
  const originalProduct = MOCK_PRODUCTS.find((p) => p.id === id);
  if(!originalProduct) {
    return <div className="flex items-center justify-center h-screen font-bold text-lg">Product not found</div>
  }

  // Map MOCK_PRODUCTS format to our detailed format
  const product = {
    ...originalProduct,
    images: [originalProduct.image], // Convert single image to array for UI
    material: "Premium Material", // Default material since it's not in mock data
    seller: {
      name: "THREADS Official",
      rating: 4.9,
      reviews: 432
    }
  };

  const details = [
    { label: 'Category', value: product.category },
    { label: 'Brand', value: product.brand || 'THREADS' },
    { label: 'Size', value: product.size || 'N/A' },
    { label: 'Condition', value: product.condition || 'N/A' },
    { label: 'Color', value: product.color || 'N/A' },
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
                  alt={product.name}
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
                    alt={`${product.name} ${index + 1}`}
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
                {product.name}
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
                    <dd className="mt-0.5 text-sm font-medium text-zinc-900 capitalize">{value}</dd>
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