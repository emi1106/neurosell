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

  return (
    <div className="min-h-screen bg-green-50">
      {/* Header */}
      

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              {product.images[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📸</div>
                    <p>Product Image</p>
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail images */}
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    width={150}
                    height={150}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-6">

            {/* Title and Price */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-green-800">€{product.price}</span>
              </div>
            </div>

            {/* Key Details */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-white rounded-lg border">
              <div>
                <span className="text-sm font-medium text-gray-500">Category</span>
                <p className="text-lg font-semibold text-gray-900">{product.category}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Brand</span>
                <p className="text-lg font-semibold text-gray-900">{product.brand}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Size</span>
                <p className="text-lg font-semibold text-gray-900">{product.size}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Condition</span>
                <p className="text-lg font-semibold text-gray-900">{product.condition}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Color</span>
                <p className="text-lg font-semibold text-gray-900">{product.color}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Material</span>
                <p className="text-lg font-semibold text-gray-900">{product.material}</p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>


            {/* Action Buttons */}
            <div className="space-y-3">
              <button className="w-full bg-green-800 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                Add to Cart
              </button>
              <button className="w-full border border-green-800 text-green-800 py-3 px-6 rounded-lg font-semibold hover:bg-green-50 transition-colors">
                Contact Seller
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}