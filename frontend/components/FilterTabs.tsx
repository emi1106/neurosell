"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const TABS = ["NEW ARRIVALS", "OUTERWEAR", "KNITWEAR", "ACCESSORIES"];

export default function FilterTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const currentCategory = searchParams.get("category")?.toUpperCase() || "NEW ARRIVALS";

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "NEW ARRIVALS") {
      params.delete("category");
    } else {
      params.set("category", value.toLowerCase());
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex w-full">
      <Tabs value={currentCategory} onValueChange={handleTabChange} className="w-full">
        <TabsList className="flex gap-2.5 bg-transparent h-10 p-0 justify-start md:justify-end w-full">
          {TABS.map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="data-[state=active]:bg-[#5a6b41] data-[state=active]:text-white bg-[#e8ecea] text-zinc-600 data-[state=inactive]:hover:bg-[#d8dcdA] rounded-full px-5 py-2 text-[9px] font-bold tracking-[0.1em] transition-all duration-300 h-8 uppercase shadow-none border-none"
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
