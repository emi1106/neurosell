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
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [predictedLabel, setPredictedLabel] = useState<number | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Map Fashion MNIST labels to frontend categories - defined early so it can be used in predictCategoryFromImage
  const labelToCategoryMap: { [key: number]: string } = {
    0: 'T-Shirts',      // T-shirt/top
    1: 'Pants',         // Trouser
    2: 'Jackets',       // Pullover
    3: 'Dresses',       // Dress
    4: 'Jackets',       // Coat
    5: 'Shoes',         // Sandal
    6: 'Shirts',        // Shirt
    7: 'Shoes',         // Sneaker
    8: 'Bags',          // Bag
    9: 'Shoes',         // Ankle boot
  };

  const predictCategoryFromImage = async (file: File) => {
    setCategoryLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('http://127.0.0.1:5000/predict-category', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const label = data.label;
        setPredictedLabel(label);
        
        // Map the label to frontend category
        const mappedCategory = labelToCategoryMap[label] || 'Other';
        setCategory(mappedCategory);
        console.log('Predicted label:', label, 'Mapped category:', mappedCategory);
      } else {
        console.error('Failed to predict category:', response.statusText);
      }
    } catch (error) {
      console.error('Error predicting category:', error);
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Display preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Predict category from image
      predictCategoryFromImage(file);
    }
  };

  const generateDescription = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/generate-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          condition,
          size,
          category,
          brand,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setDescription(data.description);
        // Clear the description error
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.description;
          return newErrors;
        });
      } else {
        console.error('Failed to generate description:', response.statusText);
        alert('Failed to generate description. Please try again.');
      }
    } catch (error) {
      console.error('Error generating description:', error);
      alert('An error occurred while generating description.');
    } finally {
      setIsLoading(false);
    }
  };

  const suggestPrice = () => {
    // Generate random price between 60 and 80
    const randomPrice = (Math.random() * (80 - 60) + 60).toFixed(2);
    setPrice(randomPrice);
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!selectedImage) newErrors.image = 'Product image is required';
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!description.trim() || description.trim().length < 20) newErrors.description = 'Description must be at least 20 characters';
    if (!category) newErrors.category = 'Category is required';
    if (!price || parseFloat(price) <= 0) newErrors.price = 'Valid price is required';
    if (!condition) newErrors.condition = 'Condition is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before submitting
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('price', parseFloat(price).toString());
      formData.append('brand', brand);
      formData.append('condition', condition);
      formData.append('material', material);
      formData.append('color', color);
      formData.append('size', size);
      
      // Include predicted label if available
      if (predictedLabel !== null) {
        formData.append('predicted_label', predictedLabel.toString());
      }

      // Get the actual file from the input
      const fileInput = document.querySelector('#image-upload') as HTMLInputElement;
      if (fileInput?.files?.[0]) {
        formData.append('image', fileInput.files[0]);
      }

      const response = await fetch('http://127.0.0.1:5000/create-listing', {
        method: 'POST',
        body: formData,
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
        setPredictedLabel(null);
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
  
  const clothingColors = [
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Navy Blue', hex: '#001f3f' },
    { name: 'Gray', hex: '#808080' },
    { name: 'Red', hex: '#FF4136' },
    { name: 'Blue', hex: '#0074D9' },
    { name: 'Green', hex: '#2ECC40' },
    { name: 'Brown', hex: '#8B4513' },
    { name: 'Beige', hex: '#F5DEB3' },
    { name: 'Cream', hex: '#FFFDD0' },
    { name: 'Olive', hex: '#808000' },
    { name: 'Burgundy', hex: '#800020' },
    { name: 'Purple', hex: '#B10DC9' },
    { name: 'Pink', hex: '#FF69B4' },
    { name: 'Orange', hex: '#FF851B' },
    { name: 'Yellow', hex: '#FFDC00' },
    { name: 'Khaki', hex: '#C3B091' },
    { name: 'Denim', hex: '#1F4788' },
  ];
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
            {errors.image && <p className="text-red-500 text-xs mb-2">{errors.image}</p>}
            <div className="grid grid-cols-2 gap-4">
              {/* Upload zone */}
              <label htmlFor="image-upload" className="relative border border-dashed border-zinc-300 bg-white/60 hover:border-zinc-500 hover:bg-white/80 transition-all duration-200 cursor-pointer group aspect-square flex items-center justify-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <div className="cursor-pointer flex flex-col items-center gap-2 text-zinc-500 group-hover:text-zinc-800 transition-colors">
                  <span className="text-3xl leading-none font-light">+</span>
                  <span className="text-xs font-bold tracking-wide">Upload image</span>
                  <span className="text-[10px] text-zinc-500">PNG, JPG up to 10MB</span>
                </div>
              </label>

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
            {errors.title && <p className="text-red-500 text-xs mb-2">{errors.title}</p>}
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
              placeholder="e.g., Vintage Levi's Denim Jacket"
            />
          </div>

          {/* Category and Price */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label className={labelClass} htmlFor="category">Category <span className="text-red-400">*</span></Label>
              {errors.category && <p className="text-red-500 text-xs mb-2">{errors.category}</p>}
              <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className={selectClass}>
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
                  className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-zinc-800 hover:text-zinc-900 transition-colors"
                >
                  Suggest
                </button>
              </div>
              {errors.price && <p className="text-red-500 text-xs mb-2">{errors.price}</p>}
              <Input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                step="0.01"
                min="0"
                className={inputClass}
                placeholder="79.99"
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
              {errors.condition && <p className="text-red-500 text-xs mb-2">{errors.condition}</p>}
              <select id="condition" value={condition} onChange={(e) => setCondition(e.target.value)} className={selectClass}>
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
              <div className="relative">
                <select
                  id="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className={selectClass}
                >
                  <option value="">Select color</option>
                  {clothingColors.map((colorOption) => (
                    <option key={colorOption.hex} value={colorOption.name}>
                      {colorOption.name}
                    </option>
                  ))}
                </select>
                {color && (
                  <div
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 border border-zinc-300 rounded pointer-events-none"
                    style={{
                      backgroundColor: clothingColors.find((c) => c.name === color)?.hex || '#000000',
                    }}
                  />
                )}
              </div>
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
            {errors.description && <p className="text-red-500 text-xs mb-2">{errors.description}</p>}
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full border border-zinc-200 bg-white rounded-sm px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 transition-colors resize-none"
              placeholder="Describe your item in detail…"
            />
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