import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full pt-32 pb-16 bg-white dark:bg-black border-t border-zinc-100 dark:border-zinc-900 mt-auto relative z-10">

      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
          <div className="max-w-sm space-y-6">
            <h2 className="text-xl font-bold tracking-tight uppercase">THREADS</h2>
            <p className="text-sm text-zinc-500 leading-relaxed font-light">
              Elevating the everyday through a focused lens on quality and form. Locally curated, globally minded.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-16 gap-y-8 text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase">
            <Link href="/privacy" className="hover:text-black transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-black transition-colors">Terms</Link>
            <Link href="/shipping" className="hover:text-black transition-colors">Shipping</Link>
            <Link href="/contact" className="hover:text-black transition-colors">Contact</Link>
          </div>
        </div>

        <div className="flex justify-between items-center text-[10px] font-bold tracking-widest text-zinc-300 uppercase">
          <p>© {currentYear} THREADS DIGITAL BOUTIQUE</p>
        </div>
      </div>
    </footer>
  );
}
