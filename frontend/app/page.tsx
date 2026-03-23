"use client";

import { useMemo, useState } from "react";

type Product = {
  id: string;
  title: string;
  description: string;
  category: string;
  condition: string;
  brand: string;
  age: string;
  price: number;
  imageUrl?: string;
  aiMessage: string;
  sold: boolean;
};

export default function Home() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [condition, setCondition] = useState("New");
  const [brand, setBrand] = useState("");
  const [age, setAge] = useState("");
  const [price, setPrice] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [aiDescription, setAiDescription] = useState("Click the AI button to generate text based on title+properties.");

  const imagePreview = useMemo(() => {
    if (!imageFile) return null;
    return URL.createObjectURL(imageFile);
  }, [imageFile]);

  const onCreateProduct = () => {
    if (!title.trim() || !description.trim() || !brand.trim() || price <= 0) {
      alert("Please enter title, description, brand, and a price > 0.");
      return;
    }

    const newProduct: Product = {
      id: crypto.randomUUID(),
      title,
      description,
      category,
      condition,
      brand,
      age,
      price,
      imageUrl: imagePreview || undefined,
      aiMessage: aiDescription,
      sold: false,
    };

    setProducts((prev) => [newProduct, ...prev]);
    setTitle("");
    setDescription("");
    setBrand("");
    setAge("");
    setPrice(0);
    setImageFile(null);
    setAiDescription("Click the AI button to generate text based on title+properties.");
  };

  const onBuy = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, sold: true } : p))
    );
  };

  const onGenerateAi = () => {
    // reserved for later AI integration
    setAiDescription(
      `AI description placeholder for '${title || "<title>"}' in ${category} (${condition}), brand ${brand || "<brand>"}, age ${age || "<age>"}.` 
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-3xl font-bold text-slate-900">Resell Marketplace</h1>

        <section className="mb-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-2xl font-semibold">List an item</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Title</span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Vintage camera"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Price</span>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="mt-1 block w-full rounded-lg border border-slate-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min={0}
                step={0.01}
              />
            </label>

            <label className="block sm:col-span-2">
              <span className="text-sm font-medium text-slate-700">Description</span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Describe the item and condition..."
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Brand</span>
              <input
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="sony, nike, ikea..."
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Age</span>
              <input
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="2 years, 2020, vintage"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Category</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Electronics</option>
                <option>Fashion</option>
                <option>Home</option>
                <option>Sports</option>
                <option>Collectibles</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Condition</span>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>New</option>
                <option>Like New</option>
                <option>Good</option>
                <option>Used</option>
                <option>For Parts</option>
              </select>
            </label>

            <label className="block sm:col-span-2">
              <span className="text-sm font-medium text-slate-700">Upload Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setImageFile(file);
                }}
                className="mt-1 block w-full text-sm text-slate-600"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mt-2 max-h-48 w-auto rounded-lg border border-slate-300"
                />
              )}
            </label>

            <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onCreateProduct}
                className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
              >
                Create Listing
              </button>

              <button
                onClick={onGenerateAi}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 hover:border-slate-400"
              >
                Generate AI Description (placeholder)
              </button>
            </div>

            <div className="sm:col-span-2 rounded-lg bg-slate-100 p-3 text-sm text-slate-700">
              <div className="font-medium">AI status:</div>
              <p>{aiDescription}</p>
            </div>
          </div>
        </section>

        <section className="grid gap-4">
          <h2 className="text-2xl font-semibold">Market listings</h2>
          {products.length === 0 ? (
            <p className="text-slate-600">No listings yet. Add one using the form above.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {products.map((product) => (
                <article
                  key={product.id}
                  className="space-y-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  {product.imageUrl && (
                    <img src={product.imageUrl} alt={product.title} className="h-40 w-full rounded-lg object-cover" />
                  )}
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-lg font-bold">{product.title}</h3>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                      {product.category}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">{product.description}</p>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                    <span>Brand: {product.brand || "—"}</span>
                    <span>Age: {product.age || "—"}</span>
                    <span>Condition: {product.condition}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <strong className="text-base">${product.price.toFixed(2)}</strong>
                    <button
                      onClick={() => onBuy(product.id)}
                      disabled={product.sold}
                      className={`rounded-lg px-3 py-1 font-semibold text-white ${
                        product.sold ? "bg-slate-400" : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {product.sold ? "Purchased" : "Buy item"}
                    </button>
                  </div>
                  <div className="text-xs font-medium text-slate-500">AI: {product.aiMessage}</div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
