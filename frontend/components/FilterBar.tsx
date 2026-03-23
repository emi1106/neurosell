"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ListFilter } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function FilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filterOptions = {
    SIZE: ["XS", "S", "M", "L", "XL", "OS"],
    COLOR: ["Black", "White", "Grey", "Camel", "Indigo", "Beige"],
    "PRICE RANGE": ["$0 - $100", "$100 - $300", "$300 - $500", "$500+"],
  };

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const paramKey = key.toLowerCase().replace(" ", "-");
    
    if (value === "all") {
      params.delete(paramKey);
    } else {
      params.set(paramKey, value);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-8 border-b border-zinc-100">
      <div className="flex flex-wrap items-center gap-8">
        {(Object.keys(filterOptions) as Array<keyof typeof filterOptions>).map((filter) => (
          <div 
            key={filter} 
            className={`flex items-center space-x-2 shrink-0 ${
              filter === "SIZE" ? "w-[90px]" : filter === "COLOR" ? "w-[125px]" : "w-[200px]"
            }`}
          >
            <span className="text-[10px] font-bold tracking-[0.2em] text-zinc-400 uppercase shrink-0">{filter}</span>
            <Select 
              value={searchParams.get(filter.toLowerCase().replace(" ", "-")) || "all"}
              onValueChange={(val) => handleFilterChange(filter, val)}
            >
              <SelectTrigger className="w-full flex-1 border-none bg-transparent hover:text-black transition-colors p-0 h-auto shadow-none focus:ring-0 text-[10px] font-bold tracking-[0.2em] gap-1 flex text-left min-w-0">
                <div className="truncate w-full text-left">
                  <SelectValue placeholder="All" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {filterOptions[filter].map((option) => (
                  <SelectItem key={option} value={option.toLowerCase()}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>

      <div className="flex items-center space-x-2 text-[10px] font-bold tracking-[0.2em] text-zinc-800 shrink-0 w-[240px]">
        <span className="text-zinc-400 uppercase whitespace-nowrap shrink-0">SORT BY</span>
        <Select 
          value={searchParams.get("sort") || "featured"}
          onValueChange={(val) => handleFilterChange("sort", val)}
        >
          <SelectTrigger className="w-full flex-1 border-none bg-transparent hover:text-black transition-colors p-0 h-auto shadow-none focus:ring-0 text-[10px] font-bold tracking-[0.2em] gap-1 flex text-left min-w-0">
            <div className="truncate w-full text-left">
              <SelectValue />
            </div>
            <ListFilter className="h-3 w-3 shrink-0" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
