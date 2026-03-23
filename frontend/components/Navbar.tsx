"use client";

import { Search, ShoppingBag, User } from "lucide-react";
import { Input } from "./ui/input";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: "SHOP", href: "/" },
    { name: "NEW LISTING", href: "/listings" },
    { name: "ABOUT", href: "/about" },
  ];

  return (
    <nav className="w-full border-b bg-white dark:bg-black px-6 py-4 flex items-center justify-between">
      {/* Left - Logo */}
      <div className="flex-1">
        <Link href="/" className="text-xl font-bold tracking-tight text-foreground uppercase">
          THREADS
        </Link>
      </div>

      {/* Center - Links */}
      <div className="flex-1 flex justify-center space-x-8 text-sm font-medium tracking-wide">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "pb-1 transition-colors duration-200",
                isActive 
                  ? "text-[#6d8a64] border-b-2 border-[#6d8a64]" 
                  : "text-muted-foreground hover:text-foreground border-b-2 border-transparent"
              )}
            >
              {link.name}
            </Link>
          );
        })}
      </div>

      {/* Right - Actions */}
      <div className="flex-1 flex justify-end items-center space-x-6">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search listed items..." 
            className="pl-9 bg-zinc-100 dark:bg-zinc-900 border-none rounded-full h-10 w-full focus-visible:ring-1 focus-visible:ring-zinc-300 dark:focus-visible:ring-zinc-700 placeholder:text-zinc-500"
          />
        </div>
        
        <button className="cursor-pointer text-zinc-800 dark:text-zinc-200 hover:text-black dark:hover:text-white transition-all duration-200 hover:scale-110 active:scale-95">
          <ShoppingBag className="h-5 w-5" />
        </button>
        
        <button className="cursor-pointer text-zinc-800 dark:text-zinc-200 hover:text-black dark:hover:text-white transition-all duration-200 hover:scale-110 active:scale-95">
          <User className="h-5 w-5" />
        </button>
      </div>
    </nav>
  );
}
