import { Heart } from "lucide-react";
import Image from "next/image";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";


interface ProductCardProps {
  product: Product;
  showFeatured?: boolean;
}

export default function ProductCard({ product, showFeatured }: ProductCardProps) {
  if (product.isFeatured && showFeatured) {
    return (
      <div className="col-span-1 md:col-span-2 group space-y-4">
        <div className="relative overflow-hidden rounded-lg aspect-[16/9] md:aspect-[2/1] bg-muted">
          <Image
            src={product.image}
            alt={product.id}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent transition-opacity group-hover:from-black/60" />
          {/* Heart Icon */}
          <Button variant="ghost" size="icon" className="absolute top-4 right-4 rounded-full bg-white shadow-sm text-zinc-800 hover:text-red-500 hover:bg-zinc-50 opacity-100 transition-all duration-300">
            <Heart className="h-4 w-4" />
          </Button>
          {/* Content Overlay */}
          <div className="absolute bottom-8 left-8 text-white z-10">
            <p className="text-[10px] font-bold tracking-[0.15em] mb-2 uppercase text-[#e9f2a9]">
              SEASON COLLECTION
            </p>
            <h3 className="text-3xl md:text-4xl font-light tracking-tight">
              The Structured Overcoat
            </h3>
          </div>
        </div>
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-zinc-900 leading-tight">
              {product.name}
            </h3>
            <p className="text-[10px] text-zinc-400 font-medium tracking-widest uppercase">
              {product.subCategory || product.category}
            </p>
          </div>
          <p className="text-sm font-medium text-zinc-400 group-hover:text-[#6d8a64] transition-colors">
            ${product.price}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="group space-y-4">
      <div className="relative aspect-[4/5] md:aspect-square overflow-hidden rounded-lg bg-zinc-50">
        <Image
          src={product.image}
          alt={product.id}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <Button variant="ghost" size="icon" className="absolute top-4 right-4 rounded-full bg-white shadow-sm text-zinc-800 hover:text-red-500 hover:bg-zinc-50 opacity-100 transition-all duration-300">
          <Heart className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-zinc-900 leading-tight">
            {product.name}
          </h3>
          <p className="text-[10px] text-zinc-400 font-bold tracking-widest uppercase">
            {product.subCategory || product.category}
          </p>
        </div>
        <p className="text-sm font-medium text-zinc-400 group-hover:text-[#6d8a64] transition-colors">
          ${product.price}
        </p>
      </div>
    </div>
  );
}
