"use client";

import Link from "next/link";
import { BookOpen, Compass, ArrowLeft } from "lucide-react";
import { useEffect } from "react";

export default function NotFound() {
  useEffect(() => {
    document.title = "BookNook | Page Not Found";
  }, []);

  return (
    <main className="min-h-[80vh] bg-[#FBF9F4] flex items-center justify-center px-6 py-24 relative overflow-hidden">
      {/* Background Pattern Decor */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-20 z-0 bg-repeat"
        style={{ backgroundImage: "url('/assets/details-bg.png')", backgroundSize: '500px auto' }}
      />

      <div className="relative z-10 max-w-xl w-full bg-[#FBF9F4] border-[3px] border-[#2D312E] rounded-[40px] p-8 sm:p-12 shadow-[12px_12px_0px_0px_#2D312E] text-center space-y-6">
        
        <div className="w-16 h-16 bg-[#3A506B] text-white rounded-2xl flex items-center justify-center mx-auto border-2 border-[#2D312E] shadow-md rotate-[-6deg]">
          <Compass size={32} />
        </div>

        <div className="space-y-2">
          <span className="bg-[#3A506B] text-white px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-[#2D312E]/20 shadow-sm">
            Error 404 • Lost Manuscript
          </span>
          <h1 className="text-4xl sm:text-5xl font-['var(--font-handwritten)'] font-bold text-[#1C242B]">
            Page Not <span className="text-[#3A506B]">Found</span>
          </h1>
          <p className="font-serif italic text-sm sm:text-base text-[#3A4045] max-w-md mx-auto leading-relaxed pt-2">
            “It appears this chapter has drifted away or the page you are looking for has been misplaced in the archives.”
          </p>
        </div>

        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-3 bg-[#2D312E] hover:bg-[#3A506B] text-[#F3EFE6] px-9 py-4 rounded-full text-xs font-black uppercase tracking-widest shadow-[6px_6px_0px_0px_#3A506B] hover:-translate-y-1 active:translate-y-0.5 transition-all cursor-pointer border-2 border-[#2D312E]"
          >
            <ArrowLeft size={16} /> Back to Home Sanctuary
          </Link>
        </div>

      </div>
    </main>
  );
}