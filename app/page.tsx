"use client";

import { useState, useEffect, useLayoutEffect, Suspense } from "react";
import Hero from "./components/Hero";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Inbox, Loader2, Sparkles, Feather, Bookmark, Compass, Eye, Flame, BookOpen, ArrowRight } from "lucide-react";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const SLIDER_ITEMS = [
  {
    id: 1,
    badge: "Gazette Feature • Vol. IV",
    title: "Sanctuary for Lost Pages & Timeless Stories",
    text: "Explore a curated digital archive where readers catalog rare volumes, share personal bookshelves, and discover their next literary obsession.",
  },
  {
    id: 2,
    badge: "Community Archive • Open Borrow",
    title: "Borrow, Read, & Return With Complete Ease",
    text: "Experience seamless book sharing with automated duplicate-borrow protection, active tracking ledgers, and community-driven collections.",
  },
  {
    id: 3,
    badge: "Rajshahi Scriptorium • Special Collection",
    title: "Leave Your Thoughts Between the Lines",
    text: "Immerse yourself in a cozy, vintage reading experience complete with secret margin notes, literary lore, and atmospheric reading sanctuaries.",
  },
];

const MARGIN_NOTES = [
  {
    id: 1,
    book: "Kabuliwala",
    reader: "Anisa S.",
    note: "“I cried on page 42. Some friendships transcend oceans and years without a single word.”",
    inkColor: "text-[#3A506B]",
    rotate: "-rotate-1",
  },
  {
    id: 2,
    book: "Behind Closed Doors",
    reader: "Naira M.",
    note: "“The psychological tension in chapter six is absolute perfection. Do not trust the glossy smile.”",
    inkColor: "text-[#8B3A3A]",
    rotate: "rotate-2",
  },
  {
    id: 3,
    book: "Classic Archive Vol. III",
    reader: "Anonymous Wanderer",
    note: "“Found a pressed marigold petal tucked between pages 118 and 119. Left it for whoever reads next.”",
    inkColor: "text-[#2D312E]",
    rotate: "-rotate-2",
  },
];

const CURIOSITY_ITEMS = [
  {
    id: "inkhorn",
    name: "The Smudged Inkhorn",
    origin: "Discovered in the Rajshahi scriptorium",
    lore: "Legend says whoever writes a book review while this inkhorn rests nearby will have their words echoed by future travelers.",
    icon: Feather,
    tag: "Artifact #04",
  },
  {
    id: "fern",
    name: "The Pressed Autumn Fern",
    origin: "Found inside an 1894 poetry anthology",
    lore: "Retains a faint scent of rain and old paper, serving as a silent bookmark for anyone brave enough to read past midnight.",
    icon: Bookmark,
    tag: "Artifact #09",
  },
  {
    id: "candle",
    name: "The Midnight Candle Stump",
    origin: "Recovered from the lower reading stacks",
    lore: "Melted down to a stub by readers who refused to put down their psychological thrillers until the final plot twist.",
    icon: Flame,
    tag: "Artifact #12",
  },
];

function NewArrivalsGrid() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/api/books`, { cache: 'no-store' });
        const result = await res.json();
        if (res.ok) {
          const allBooks = result.data || result.books || [];
          setBooks(allBooks.slice(0, 6)); // Get latest 6 books
        }
      } catch (error) {
        console.error("Backend offline or unreachable:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNewArrivals();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {[1, 2, 3].map((n) => (
          <div key={n} className="h-96 bg-[#EAE5D9]/50 rounded-[35px] animate-pulse border-2 border-[#2D312E]/10 flex items-center justify-center">
            <Loader2 className="animate-spin text-[#3A506B]" size={32} />
          </div>
        ))}
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="bg-[#EAE5D9]/50 border-[3px] border-dashed border-[#2D312E]/20 rounded-[35px] py-16 text-center max-w-md mx-auto">
        <Inbox className="mx-auto text-[#6B7280] mb-3 opacity-50" size={40} />
        <p className="font-serif italic text-sm text-[#6B7280]">No books found in the archive repository.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      {books.map((book: any) => {
        const isOutOfStock = book.totalCopies <= 0;
        return (
          <div 
            key={book._id}
            className="bg-[#FBF9F4] border-[3px] border-[#2D312E] rounded-[35px] p-6 shadow-[8px_8px_0px_0px_#2D312E] relative group h-full flex flex-col justify-between transition-transform duration-300 hover:-translate-y-2"
          >
            {/* Category Badge */}
            <div className="absolute -top-3 -left-3 bg-[#3A506B] text-white px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border-2 border-[#2D312E] rotate-[-5deg] z-20 shadow-md">
              {book.category}
            </div>

            {/* Copies Badge */}
            <div className={`absolute -top-3 -right-3 px-3.5 py-1 rounded-full font-black text-[9px] uppercase tracking-wider rotate-6 border-2 shadow-md z-10 ${isOutOfStock ? 'bg-red-600 text-white border-[#2D312E]' : 'bg-[#2D312E] text-[#F3EFE6] border-[#FBF9F4]'}`}>
              {isOutOfStock ? '0 Copies' : `${book.totalCopies} Copies`}
            </div>

            {/* Book Image Frame */}
            <Link href={`/books/${book._id}`} className="w-full h-80 bg-[#EFECE6] rounded-[25px] border-2 border-[#2D312E]/15 mb-6 overflow-hidden flex items-center justify-center p-4 relative cursor-pointer shadow-inner">
              <Image 
                src={book.image} 
                alt={book.title}
                fill
                className={`object-contain p-2 group-hover:scale-105 transition-transform duration-500 rounded-[20px] ${isOutOfStock ? 'opacity-40 grayscale' : ''}`}
              />
              {isOutOfStock && (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <span className="bg-red-700 text-white px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest border-2 border-[#2D312E] -rotate-12 shadow-2xl">
                    Not Available
                  </span>
                </div>
              )}
            </Link>

            {/* Book Info */}
            <div className="space-y-1 mb-6">
              <h3 className="font-serif font-bold text-2xl text-[#1C242B] tracking-tight line-clamp-1 group-hover:text-[#3A506B] transition-colors">
                {book.title}
              </h3>
              <p className="font-sans text-xs uppercase tracking-wider text-[#6B7280] font-semibold">
                By {book.author}
              </p>
            </div>

            {/* Action Button */}
            <div className="mt-auto">
              <Link
                href={`/books/${book._id}`}
                className="w-full bg-[#2D312E] hover:bg-[#3A506B] text-[#F3EFE6] py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md text-xs font-sans uppercase tracking-widest font-bold cursor-pointer"
              >
                View Details
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Home() {
  useIsomorphicLayoutEffect(() => {
    document.title = "BookNook | A Small Online Library";
  }, []);

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [selectedCuriosity, setSelectedCuriosity] = useState(CURIOSITY_ITEMS[0]);

  return (
    <main className="min-h-screen bg-[#FBF9F4] relative overflow-x-hidden">
      {/* Background Pattern Decor */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-30 z-0 bg-repeat"
        style={{ backgroundImage: "url('/assets/details-bg.png')", backgroundSize: '500px auto' }}
      />

      <div className="relative z-10">
        {/* Hero Section */}
        <Hero />

        {/* Banner / Slider Section with Swiper.js */}
        <section className="py-12 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto">
          <div className="text-center mb-8 space-y-2">
            <span className="bg-[#3A506B] text-white px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-[#2D312E]/20 shadow-sm">
              The Gazette Carousel • Featured Highlights
            </span>
          </div>

          <div className="bg-[#FBF9F4] border-[3px] border-[#2D312E] rounded-[40px] shadow-[12px_12px_0px_0px_#2D312E] overflow-hidden relative min-h-[300px]">
            {!isMounted ? (
              <div className="py-24 text-center">
                <Loader2 className="animate-spin text-[#3A506B] mx-auto" size={32} />
              </div>
            ) : (
              <Swiper
                modules={[Autoplay, Pagination, EffectFade]}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                spaceBetween={30}
                centeredSlides={true}
                loop={true}
                autoplay={{
                  delay: 4500,
                  disableOnInteraction: false,
                }}
                pagination={{
                  clickable: true,
                }}
                className="w-full py-16 sm:py-20 px-8 sm:px-16"
              >
                {SLIDER_ITEMS.map((slide) => (
                  <SwiperSlide key={slide.id}>
                    <div className="max-w-3xl mx-auto text-center space-y-6">
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3A506B] text-white text-[10px] font-black uppercase tracking-widest border border-[#2D312E]/20 shadow-sm">
                        <Sparkles size={12} /> {slide.badge}
                      </div>

                      <h2 className="text-3xl sm:text-5xl font-['var(--font-handwritten)'] font-bold text-[#1C242B] leading-tight">
                        {slide.title}
                      </h2>

                      <p className="font-serif italic text-base sm:text-lg text-[#3A4045] max-w-2xl mx-auto leading-relaxed">
                        “{slide.text}”
                      </p>

                      <div className="pt-2">
                        <Link
                          href="/all-books"
                          className="inline-flex items-center gap-3 bg-[#2D312E] hover:bg-[#3A506B] text-[#F3EFE6] px-9 py-3.5 rounded-full text-xs font-black uppercase tracking-widest shadow-[6px_6px_0px_0px_#3A506B] hover:-translate-y-1 active:translate-y-0.5 transition-all cursor-pointer border-2 border-[#2D312E]"
                        >
                          Browse Books <ArrowRight size={16} />
                        </Link>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
        </section>

        {/* New Arrivals Section */}
        <section className="py-24 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto">
          <div className="flex flex-col items-center mb-16 text-center">
            <span className="bg-[#3A506B] text-white px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-[#2D312E]/20 shadow-sm mb-3">
              Library Collection • Archive
            </span>
            <h2 className="text-4xl sm:text-5xl font-['var(--font-handwritten)'] font-bold text-[#1C242B]">
              New <span className="text-[#3A506B]">Arrivals</span>
            </h2>
            <p className="font-serif italic text-sm sm:text-base text-[#3A4045] mt-2 max-w-md">
              “Explore the latest literary treasures freshly cataloged for our traveling readers.”
            </p>
          </div>

          <Suspense fallback={
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-96 bg-[#EAE5D9]/50 rounded-[35px] animate-pulse border-2 border-[#2D312E]/10" />
              ))}
            </div>
          }>
            <NewArrivalsGrid />
          </Suspense>

          {/* See All Books Button */}
          <div className="text-center mt-16">
            <Link
              href="/all-books"
              className="inline-flex items-center gap-3 bg-[#FBF9F4] text-[#2D312E] border-[3px] border-[#2D312E] px-10 py-4 rounded-full text-[11px] font-black uppercase tracking-widest shadow-[6px_6px_0px_0px_#2D312E] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#2D312E] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              See All Books Archive
            </Link>
          </div>
        </section>

        {/* Creative Section 1: The Traveling Marginalia (Interactive Reader Scrawls) */}
        <section className="py-24 px-6 sm:px-12 lg:px-20 border-t border-[#2D312E]/10 bg-[#EAE5D9]/30 backdrop-blur-[2px] relative overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 space-y-3">
              <span className="bg-[#3A506B] text-white px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-[#2D312E]/20 shadow-sm">
                Secret Archive • Scrawled in the Margins
              </span>
              <h3 className="text-4xl sm:text-5xl font-['var(--font-handwritten)'] font-bold text-[#1C242B]">
                The Traveling <span className="text-[#3A506B]">Marginalia</span>
              </h3>
              <p className="font-serif italic text-sm sm:text-base text-[#3A4045] max-w-lg mx-auto">
                “Confessions, tears, and late-night thoughts left behind by readers between the lines of our catalog.”
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {MARGIN_NOTES.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.03, rotate: 0 }}
                  className={`bg-[#FBF9F4] border-[3px] border-[#2D312E] rounded-[30px] p-8 shadow-[6px_6px_0px_0px_#2D312E] relative flex flex-col justify-between ${item.rotate} transition-transform duration-300`}
                >
                  <div className="absolute top-4 right-4 text-[#6B7280]/30">
                    <Feather size={22} />
                  </div>

                  <div className="space-y-4">
                    <span className="inline-block px-3 py-1 rounded-full bg-[#3A506B]/10 text-[#3A506B] text-[9px] font-sans font-black uppercase tracking-widest border border-[#3A506B]/20">
                      From: {item.book}
                    </span>
                    <p className={`font-serif italic text-lg ${item.inkColor} leading-relaxed pt-2`}>
                      {item.note}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-[#2D312E]/10 flex items-center justify-between">
                    <span className="font-sans text-[10px] uppercase font-bold tracking-widest text-[#6B7280]">
                      Scrawled by {item.reader}
                    </span>
                    <span className="text-xs">✒️</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Creative Section 2: The Cabinet of Curiosities & Relics */}
        <section className="py-24 px-6 sm:px-12 lg:px-20 border-t border-[#2D312E]/10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 space-y-3">
              <span className="bg-[#3A506B] text-white px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-[#2D312E]/20 shadow-sm">
                Relics • Archive Basement
              </span>
              <h3 className="text-4xl sm:text-5xl font-['var(--font-handwritten)'] font-bold text-[#1C242B]">
                Cabinet of <span className="text-[#3A506B]">Curiosities</span>
              </h3>
              <p className="font-serif italic text-sm sm:text-base text-[#3A4045] max-w-lg mx-auto">
                “Inspect the mysterious artifacts recovered from the foundational shelves of BookNook.”
              </p>
            </div>

            <div className="bg-[#FBF9F4] border-[3px] border-[#2D312E] rounded-[35px] p-8 sm:p-12 shadow-[10px_10px_0px_0px_#2D312E] grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              
              {/* Left Item Selector */}
              <div className="md:col-span-5 space-y-3">
                {CURIOSITY_ITEMS.map((item) => {
                  const IconC = item.icon;
                  const active = selectedCuriosity.id === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedCuriosity(item)}
                      className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer ${
                        active
                          ? "bg-[#2D312E] text-[#F3EFE6] border-[#2D312E] shadow-md translate-x-1"
                          : "bg-[#EFECE6]/60 text-[#1C242B] border-[#2D312E]/20 hover:bg-[#EAE5D9]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${active ? 'bg-[#3A506B] border-white/20 text-white' : 'bg-[#FBF9F4] border-[#2D312E]/20 text-[#3A506B]'}`}>
                          <IconC size={18} />
                        </div>
                        <div>
                          <h4 className="font-serif font-bold text-sm tracking-tight">{item.name}</h4>
                          <p className={`text-[9px] uppercase tracking-wider ${active ? 'text-[#F3EFE6]/70' : 'text-[#6B7280]'}`}>{item.tag}</p>
                        </div>
                      </div>
                      <Eye size={16} className={active ? 'text-[#F3EFE6]' : 'text-[#6B7280]'} />
                    </button>
                  );
                })}
              </div>

              {/* Right Relic Inspection Box */}
              <div className="md:col-span-7">
                <motion.div
                  key={selectedCuriosity.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="bg-[#EFECE6]/60 border-2 border-[#2D312E]/20 rounded-[25px] p-8 space-y-6 shadow-inner relative overflow-hidden"
                >
                  <div className="absolute top-4 right-4 bg-[#3A506B] text-white px-3 py-1 rounded-full text-[9px] uppercase tracking-widest font-black">
                    {selectedCuriosity.tag}
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#6B7280] font-bold">
                      {selectedCuriosity.origin}
                    </span>
                    <h3 className="text-3xl font-serif font-bold text-[#1C242B]">
                      {selectedCuriosity.name}
                    </h3>
                  </div>

                  <p className="font-serif italic text-base text-[#3A4045] leading-relaxed">
                    “{selectedCuriosity.lore}”
                  </p>

                  <div className="pt-4 border-t border-[#2D312E]/15 flex items-center justify-between text-xs font-sans font-semibold text-[#6B7280]">
                    <span>Status: Preserved & Cataloged</span>
                    <span className="text-[#3A506B] font-bold">BookNook Relic Registry</span>
                  </div>
                </motion.div>
              </div>

            </div>
          </div>
        </section>

      </div>
    </main>
  );
}