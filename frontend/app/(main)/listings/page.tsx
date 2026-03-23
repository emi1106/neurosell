'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

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
    setTimeout(() => {
      setDescription('This is an AI-generated description based on the uploaded image and title. The item appears to be in excellent condition with authentic branding and classic styling.');
      setIsLoading(false);
    }, 2000);
  };

  const suggestPrice = () => {
    setIsLoading(true);
    setTimeout(() => {
      setPrice('79.99');
      setIsLoading(false);
    }, 1500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/create-listing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          category,
          price: parseFloat(price),
          brand,
          condition,
          material,
          color,
          size,
          image: selectedImage
        }),
      });

      if (response.ok) {
        alert('Item uploaded successfully!');
        // Optional: clear form
        setTitle('');
        setDescription('');
        setCategory('');
        setPrice('');
        setBrand('');
        setCondition('');
        setMaterial('');
        setColor('');
        setSize('');
        setSelectedImage(null);
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(`Failed to upload item: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred. Make sure the backend is running on port 5000.');
    } finally {
      setIsLoading(false);
    }
  };

  const categories = ['T-Shirts', 'Shirts', 'Jackets', 'Pants', 'Dresses', 'Skirts', 'Shoes', 'Accessories', 'Bags', 'Hats', 'Jewellery', 'Other'];
  const conditions = ['New with tags', 'New without tags', 'Excellent', 'Very Good', 'Good', 'Fair', 'Poor'];
  const clothingSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
  const shoeSizes = Array.from({ length: 21 }, (_, i) => (28 + i).toString());

  const getSizeOptions = () => {
    if (!category) return [];
    if (category === 'Shoes') return shoeSizes;
    if (['T-Shirts', 'Shirts', 'Jackets', 'Pants', 'Dresses', 'Skirts'].includes(category)) return clothingSizes;
    return [];
  };

  const currentSizes = getSizeOptions();

  const inputClass = "w-full h-11 border border-zinc-200 bg-white rounded-sm px-3 text-sm text-zinc-900 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-900 focus:ring-0 transition-colors";
  const selectClass = "w-full h-11 border border-zinc-200 bg-white rounded-sm px-3 text-sm text-zinc-900 focus:outline-none focus:border-zinc-900 transition-colors appearance-none cursor-pointer";
  const labelClass = "block text-[10px] font-bold tracking-[0.15em] uppercase text-zinc-800 mb-2";

  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-white/90 backdrop-blur-sm" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Page Header */}
        <div className="mb-12">
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-600 mb-3">New Listing</p>
          <h1 className="text-5xl md:text-6xl font-medium tracking-tighter text-zinc-900 leading-[0.9]">
            Share Your<br />Style
          </h1>
          <p className="mt-4 text-sm text-zinc-700 font-medium leading-relaxed max-w-md">
            List your pre-loved fashion and connect with sustainable shoppers worldwide.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">

          {/* Image Upload */}
          <div>
            <label className={labelClass}>Product Images <span className="text-red-400">*</span></label>
            <div className="grid grid-cols-2 gap-4">
              {/* Upload zone */}
              <div className="relative border border-dashed border-zinc-300 bg-white/60 hover:border-zinc-500 hover:bg-white/80 transition-all duration-200 cursor-pointer group aspect-square flex items-center justify-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center gap-2 text-zinc-500 group-hover:text-zinc-800 transition-colors">
                  <span className="text-3xl leading-none font-light">+</span>
                  <span className="text-xs font-bold tracking-wide">Upload image</span>
                  <span className="text-[10px] text-zinc-500">PNG, JPG up to 10MB</span>
                </label>
              </div>

              {/* Preview */}
              <div className="border border-zinc-200 bg-zinc-50 aspect-square overflow-hidden flex items-center justify-center">
                {selectedImage ? (
                  <Image src={selectedImage} alt="Preview" width={300} height={300} className="w-full h-full object-cover" />
                ) : (
                  <p className="text-[10px] font-bold tracking-widest uppercase text-zinc-500">Preview</p>
                )}
              </div>
            </div>
          </div>

          {/* Title */}
          <div>
            <Label className={labelClass} htmlFor="title">Title <span className="text-red-400">*</span></Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
              placeholder="e.g., Vintage Levi's Denim Jacket"
              required
            />
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className={labelClass} htmlFor="description">Description <span className="text-red-400">*</span></Label>
              <button
                type="button"
                onClick={generateDescription}
                disabled={isLoading}
                className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-zinc-600 hover:text-zinc-900 disabled:opacity-40 transition-colors"
              >
                <Sparkles className="h-3 w-3" />
                {isLoading ? 'Generating…' : 'AI Generate'}
              </button>
            </div>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full border border-zinc-200 bg-white rounded-sm px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 transition-colors resize-none"
              placeholder="Describe your item in detail…"
              required
            />
          </div>

          {/* Category and Price */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label className={labelClass} htmlFor="category">Category <span className="text-red-400">*</span></Label>
              <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className={selectClass} required>
                <option value="">Select category</option>
                {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className={labelClass} htmlFor="price">Price (€) <span className="text-red-400">*</span></Label>
                <button
                  type="button"
                  onClick={suggestPrice}
                  disabled={isLoading}
                  className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-zinc-800 hover:text-zinc-900 disabled:opacity-40 transition-colors"
                >
                  <Sparkles className="h-3 w-3" />
                  {isLoading ? 'Suggesting…' : 'AI Suggest'}
                </button>
              </div>
              <Input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                step="0.01"
                min="0"
                className={inputClass}
                placeholder="79.99"
                required
              />
            </div>
          </div>

          {/* Brand and Condition */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label className={labelClass} htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className={inputClass}
                placeholder="e.g., Levi's, Nike, Zara"
              />
            </div>
            <div>
              <Label className={labelClass} htmlFor="condition">Condition <span className="text-red-400">*</span></Label>
              <select id="condition" value={condition} onChange={(e) => setCondition(e.target.value)} className={selectClass} required>
                <option value="">Select condition</option>
                {conditions.map((cond) => <option key={cond} value={cond}>{cond}</option>)}
              </select>
            </div>
          </div>

          {/* Material, Color, Size */}
          <div className="grid grid-cols-3 gap-6">
            <div>
              <Label className={labelClass} htmlFor="material">Material</Label>
              <Input
                id="material"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className={inputClass}
                placeholder="e.g., 100% Cotton"
              />
            </div>
            <div>
              <Label className={labelClass} htmlFor="color">Color</Label>
              <Input
                id="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className={inputClass}
                placeholder="e.g., Navy Blue"
              />
            </div>
            <div>
              <Label className={labelClass} htmlFor="size">Size</Label>
              <select
                id="size"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                disabled={currentSizes.length === 0}
                className={`${selectClass} disabled:bg-zinc-50 disabled:text-zinc-400 disabled:cursor-not-allowed`}
              >
                <option value="">
                  {currentSizes.length === 0 ? 'N/A' : 'Select size'}
                </option>
                {currentSizes.map((s: string) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-6 border-t border-zinc-100">
            <Button
              type="submit"
              className="w-full h-12 bg-zinc-900 hover:bg-zinc-800 text-white rounded-none font-bold tracking-[0.2em] uppercase text-xs transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              Upload Item
            </Button>
            <p className="text-center text-zinc-600 text-[10px] font-bold tracking-wide uppercase mt-4">
              Your item will be live immediately after upload
            </p>
          </div>

        </form>
      </div>
    </div>
  );
}