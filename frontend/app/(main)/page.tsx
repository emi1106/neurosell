import { Suspense } from "react";
import FilterTabs from "@/components/FilterTabs";
import FilterBar from "@/components/FilterBar";
import ProductGrid from "@/components/ProductGrid";
import AppPagination from "@/components/Pagination";

import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans dark:bg-black relative">
      {/* Background Image Texture */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40 mix-blend-multiply dark:opacity-10 dark:mix-blend-overlay" aria-hidden="true">
        <Image
          src="/main.png"
          alt="Background Texture"
          fill
          className="object-cover"
          priority
        />
      </div>
      
      <main className="flex-1 max-w-[1440px] mx-auto px-6 md:px-12 pt-16 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 space-y-8 md:space-y-0 text-left mt-4">
          <div className="max-w-xl">
            <h1 className="text-6xl md:text-[80px] font-medium tracking-tighter text-zinc-900 dark:text-white leading-[0.9] mb-6">
              Essential<br />Curations
            </h1>
            <p className="max-w-sm text-sm text-zinc-500 font-light leading-relaxed">
              A deliberate selection of enduring garments
              <br className="hidden md:block" />
              designed for the modern minimalist.
            </p>
          </div>
          
          <div className="pb-2 w-full md:w-auto">
            <Suspense fallback={<div className="h-10 w-[400px] animate-pulse bg-zinc-100 rounded-full" />}>
              <FilterTabs />
            </Suspense>
          </div>
        </div>

        {/* Filters and Grid Section */}
        <div className="w-full">
          <Suspense fallback={<div className="h-20 w-full animate-pulse bg-zinc-50 rounded-lg" />}>
            <FilterBar />
          </Suspense>
          
          <Suspense fallback={<div className="grid grid-cols-4 gap-6 py-8"><div className="aspect-square bg-zinc-50 animate-pulse rounded-lg" /></div>}>
            <ProductGrid />
          </Suspense>
          
          <AppPagination />
        </div>
      </main>
    </div>
  );
}
