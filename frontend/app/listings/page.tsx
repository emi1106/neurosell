'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function UploadPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [brand, setBrand] = useState('');
  const [condition, setCondition] = useState('');
  const [material, setMaterial] = useState('');
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateDescription = () => {
    setIsLoading(true);
    // Simulate AI description generation
    setTimeout(() => {
      setDescription('This is an AI-generated description based on the uploaded image and title. The item appears to be in excellent condition with authentic branding and classic styling.');
      setIsLoading(false);
    }, 2000);
  };

  const suggestPrice = () => {
    setIsLoading(true);
    // Simulate AI price suggestion
    setTimeout(() => {
      setPrice('79.99');
      setIsLoading(false);
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', {
      title,
      description,
      category,
      price,
      brand,
      condition,
      material,
      color,
      size,
      image: selectedImage
    });
    alert('Item uploaded successfully!');
  };

  const categories = [
    'T-Shirts', 'Shirts', 'Jackets', 'Pants', 'Dresses', 'Skirts',
    'Shoes', 'Accessories', 'Bags', 'Hats', 'Jewellery', 'Other'
  ];

  const conditions = [
    'New with tags', 'New without tags', 'Excellent', 'Very Good',
    'Good', 'Fair', 'Poor'
  ];

  // Size options based on category
  const clothingSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
  const shoeSizes = Array.from({ length: 21 }, (_, i) => (28 + i).toString());
  
  const getSizeOptions = () => {
    if (!category) return [];
    if (category === 'Shoes') return shoeSizes;
    // All other clothing categories with sizes
    if (['T-Shirts', 'Shirts', 'Jackets', 'Pants', 'Dresses', 'Skirts'].includes(category)) {
      return clothingSizes;
    }
    // Categories without sizes: Jewellery, Accessories, Bags, Hats, Other
    return [];
  };

  const currentSizes = getSizeOptions();

  return (
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
     

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl border border-green-100 p-8 md:p-12">
          <div className="mb-10">
            <div className="inline-block bg-green-50 px-4 py-2 rounded-full mb-4 border border-green-200">
              <p className="text-sm font-semibold text-green-800">NEW LISTING</p>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-3 leading-tight">
              Share Your <span className="text-green-800">Style</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">List your pre-loved fashion and connect with sustainable shoppers worldwide</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Image Upload */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                Product Images <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <div className="relative border-2 border-dashed border-green-300 rounded-xl p-8 text-center hover:border-green-500 hover:bg-green-50 transition-all duration-300 cursor-pointer group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer block">
                      <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">+</div>
                      <p className="text-gray-700 font-medium text-lg">Click to upload image</p>
                      <p className="text-sm text-gray-500 mt-2">PNG, JPG up to 10MB</p>
                    </label>
                  </div>
                </div>

                <div className="border-2 border-green-200 rounded-xl overflow-hidden bg-gradient-to-br from-green-50 to-white shadow-md">
                  {selectedImage ? (
                    <Image
                      src={selectedImage}
                      alt="Preview"
                      width={300}
                      height={300}
                      className="w-full h-64 object-cover"
                    />
                  ) : (
                    <div className="w-full h-64 flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <div className="text-4xl mb-2">[ ]</div>
                        <p className="font-medium">Preview</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-lg font-semibold text-gray-900 mb-3">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-lg"
                placeholder="e.g., Vintage Levi's Denim Jacket"
                required
              />
            </div>

            {/* Description */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label htmlFor="description" className="block text-lg font-semibold text-gray-900">
                  Description <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={generateDescription}
                  disabled={isLoading}
                  className="px-4 py-2 text-white rounded-lg text-sm font-medium hover:shadow-lg hover:scale-105 disabled:opacity-50 transition-all duration-200"
                  style={{ backgroundColor: 'rgb(85, 107, 47)' }}
                >
                  {isLoading ? 'Generating...' : 'AI Generate'}
                </button>
              </div>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                placeholder="Describe your item in detail..."
                required
              />
            </div>

            {/* Category and Price Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="category" className="block text-lg font-semibold text-gray-900 mb-3">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-lg"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label htmlFor="price" className="block text-lg font-semibold text-gray-900">
                    Price (€) <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={suggestPrice}
                    disabled={isLoading}
                    className="px-4 py-2 text-white rounded-lg text-sm font-medium hover:shadow-lg hover:scale-105 disabled:opacity-50 transition-all duration-200"
                    style={{ backgroundColor: 'rgb(85, 107, 47)' }}
                  >
                    {isLoading ? 'Suggesting...' : 'AI Suggest'}
                  </button>
                </div>
                <input
                  type="number"
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-lg"
                  placeholder="79.99"
                  required
                />
              </div>
            </div>

            {/* Brand and Condition Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="brand" className="block text-lg font-semibold text-gray-900 mb-3">
                  Brand
                </label>
                <input
                  type="text"
                  id="brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-lg"
                  placeholder="e.g., Levi's, Nike, Zara"
                />
              </div>

              <div>
                <label htmlFor="condition" className="block text-lg font-semibold text-gray-900 mb-3">
                  Condition <span className="text-red-500">*</span>
                </label>
                <select
                  id="condition"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-lg"
                  required
                >
                  <option value="">Select condition</option>
                  {conditions.map((cond) => (
                    <option key={cond} value={cond}>{cond}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Material, Color, Size Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <label htmlFor="material" className="block text-lg font-semibold text-gray-900 mb-3">
                  Material
                </label>
                <input
                  type="text"
                  id="material"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-lg"
                  placeholder="e.g., 100% Cotton"
                />
              </div>

              <div>
                <label htmlFor="color" className="block text-lg font-semibold text-gray-900 mb-3">
                  Color
                </label>
                <input
                  type="text"
                  id="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-lg"
                  placeholder="e.g., Navy Blue"
                />
              </div>

              <div>
                <label htmlFor="size" className="block text-lg font-semibold text-gray-900 mb-3">
                  Size
                </label>
                <select
                  id="size"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  disabled={currentSizes.length === 0}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-lg disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {currentSizes.length === 0 
                      ? 'N/A for this category' 
                      : 'Select size'}
                  </option>
                  {currentSizes.map((s: string) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-8 border-t-2 border-gray-100">
              <button
                type="submit"
                className="w-full text-white py-4 px-6 rounded-xl font-bold text-lg hover:shadow-2xl active:scale-95 transition-all duration-200"
                style={{ backgroundColor: 'rgb(85, 107, 47)' }}
              >
                 Upload Item
              </button>
              <p className="text-center text-gray-500 text-sm mt-4">Your item will be live immediately after upload</p>
            </div>
          </form>
        </div>
      </div>
      </div>

  );
}