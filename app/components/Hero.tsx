"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] pt-32 pb-16 px-6 sm:px-12 lg:px-20 bg-[#F1EDE2] flex items-center justify-center overflow-hidden">
      
      {/* 1. Framed Van Gogh Canvas Container (Shadow removed) */}
      <div className="relative w-full max-w-7xl h-[82vh] min-h-[560px] rounded-3xl overflow-hidden border border-[#2D312E]/15 bg-[#FBF9F4] flex flex-col justify-end px-10 sm:px-16 pb-12">
        
        {/* Van Gogh Textured Background */}
        <div 
          className="absolute inset-0 opacity-65 pointer-events-none bg-cover bg-center mix-blend-multiply"
          style={{ backgroundImage: `url('/assets/vangogh-bg.png')` }}
        />

        {/* 2. Positioned down in the bottom-left marked vacant space */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative z-30 max-w-md ml-4 sm:ml-8 text-left space-y-3"
        >
          <div className="inline-block bg-[#E5E0D0]/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#2D312E]/10 shadow-sm">
            <span className="text-[11px] uppercase tracking-widest font-semibold text-[#3A4348]">
              Online Literary Gazette • 2026
            </span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-['var(--font-handwritten)'] font-bold text-[#1C242B] tracking-wide drop-shadow-sm rotate-[-1deg]">
            Book<span className="text-[#3A506B]">Nook</span>
          </h1>

          <p className="font-serif italic text-sm sm:text-base text-[#301915] font-medium leading-relaxed drop-shadow-sm">
            “Add a book, borrow a chapter of history, and return it for the next traveler.”
          </p>

          {/* Button aligned to the right edge of the text block container */}
          <div className="pt-2 flex justify-end">
            <Link
              href="/books"
              className="inline-block bg-[#2C3E50] hover:bg-[#1A252F] text-[#F3EFE6] px-6 py-3 rounded-xl font-sans text-xs uppercase tracking-wider font-semibold shadow-lg transition-all transform active:scale-95"
            >
              Explore Archive
            </Link>
          </div>
        </motion.div>
      </div>

      {/* 3. Sprawling Gnarled Tree sliding smoothly from left */}
      <motion.div 
        initial={{ opacity: 0, x: -120 }}
        animate={{ opacity: 0.98, x: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-0 pointer-events-none z-20 w-full h-full flex items-center justify-start overflow-hidden"
      >
        <div className="relative w-[105rem] h-[110vh] -ml-16 flex items-center">
          <Image
            src="/assets/vintage-tree.png"
            alt="Vintage Branch Silhouette"
            fill
            className="object-contain object-left"
            priority
          />
        </div>
      </motion.div>

    </section>
  );
}