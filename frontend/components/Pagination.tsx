"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function AppPagination() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-20">
      <Pagination>
        <PaginationContent className="gap-4">
          <PaginationItem>
            <PaginationPrevious 
              href="#" 
              className="text-zinc-400 hover:text-black transition-colors border-none hover:bg-transparent"
            />
          </PaginationItem>
          
          <PaginationItem>
            <PaginationLink 
              href="#" 
              isActive 
              className="w-10 h-10 flex items-center justify-center rounded-full text-xs font-semibold tracking-tighter transition-all duration-200 bg-[#6d8a64] text-white hover:bg-[#5b7554]"
            >
              1
            </PaginationLink>
          </PaginationItem>
          
          <PaginationItem>
            <PaginationLink href="#" className="text-zinc-400 hover:text-black border-none hover:bg-transparent text-xs font-semibold">2</PaginationLink>
          </PaginationItem>
          
          <PaginationItem>
            <PaginationLink href="#" className="text-zinc-400 hover:text-black border-none hover:bg-transparent text-xs font-semibold">3</PaginationLink>
          </PaginationItem>
          
          <PaginationItem>
            <PaginationEllipsis className="text-zinc-400" />
          </PaginationItem>
          
          <PaginationItem>
            <PaginationLink href="#" className="text-zinc-400 hover:text-black border-none hover:bg-transparent text-xs font-semibold">12</PaginationLink>
          </PaginationItem>
          
          <PaginationItem>
            <PaginationNext href="#" className="text-zinc-400 hover:text-black transition-colors border-none hover:bg-transparent" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      
      <p className="text-[10px] font-bold text-zinc-300 tracking-[0.2em] uppercase">
        Showing 1-12 of 144 items
      </p>
    </div>
  );
}
