"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, Loader2, Inbox, ArrowLeft, Search, Layers } from "lucide-react";

interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  totalCopies: number;
}

const CATEGORY_PILLS = [
  { name: "All Volumes", value: "All" },
  { name: "Fiction", value: "Fiction" },
  { name: "Science", value: "Science" },
  { name: "History", value: "History" },
  { name: "Kids", value: "Kids" },
  { name: "Others", value: "Others" },
];

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AllBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchAllBooks = async () => {
      try {
        setLoading(true);
        // API endpoint to fetch all books
        const res = await fetch(`${API_BASE_URL}/api/books`);
        const json = await res.json();
        if (res.ok) {
          setBooks(json.data || json.books || []);
        }
      } catch (err) {
        console.error("Failed to fetch all books archive:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllBooks();
  }, []);

  // Filter books based on category and live search input
  const filteredBooks = books.filter((book) => {
    const matchesCategory = 
      selectedCategory === "All" || book.category?.toLowerCase() === selectedCategory.toLowerCase();
    
    const matchesSearch = 
      book.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-[#FBF9F4] text-[#1C242B] py-24 px-6 md:px-12 relative overflow-hidden font-serif">
      
      {/* Background Vintage Texture */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-30 z-0 bg-repeat"
        style={{ backgroundImage: "url('/assets/details-bg.png')", backgroundSize: '500px auto' }}
      />

      <div className="max-w-7xl mx-auto relative z-10 space-y-10 pt-12">
        
        {/* BACK TO HOME NAVIGATION */}
        <div>
          <Link 
            href="/" 
            className="group inline-flex items-center gap-3 hover:opacity-80 transition-all uppercase text-[10px] font-black tracking-widest font-sans"
          >
            <div className="w-10 h-10 border-2 border-[#2D312E] bg-[#FBF9F4] rounded-full flex items-center justify-center group-hover:bg-[#3A506B] group-hover:text-white transition-colors shadow-sm">
              <ArrowLeft size={18} />
            </div>
            <span className="bg-[#FBF9F4]/90 px-3 py-1.5 rounded-full border border-[#2D312E]/20 shadow-sm text-[#1C242B]">
              Back to Home
            </span>
          </Link>
        </div>

        {/* HEADER */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#3A506B] text-white text-[9px] uppercase tracking-widest font-black border border-[#2D312E]">
            <Sparkles size={10} /> Library Collection Registry
          </div>
          <h1 className="text-4xl sm:text-6xl font-['var(--font-handwritten)'] font-bold text-[#1C242B]">
            Explore All <span className="text-[#3A506B]">Volumes</span>
          </h1>
          <p className="font-serif italic text-xs sm:text-sm text-[#6B7280]">
            Browse, search, and filter through community contributions and timeless literary archives.
          </p>
        </div>

        {/* SEARCH AND FILTER CONTROL PANEL */}
        <div className="sticky top-16 z-40 w-full py-4 space-y-4 bg-[#FBF9F4]/95 backdrop-blur-md">
          
          {/* SEARCH BAR */}
          <div className="max-w-xl mx-auto px-4">
            <div className="relative rounded-2xl bg-[#EFECE6]/70 border-2 border-[#2D312E] focus-within:border-[#3A506B] transition-all overflow-hidden shadow-[4px_4px_0px_0px_#2D312E]">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#6B7280]">
                <Search size={18} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by book title or author name..."
                className="w-full pl-12 pr-4 py-3.5 text-xs font-sans font-semibold text-[#1C242B] bg-transparent outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs font-bold text-[#6B7280] hover:text-[#1C242B] uppercase tracking-wider cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* STICKY CATEGORY PILLS */}
          <div className="flex justify-center">
            <div className="bg-[#2D312E] p-1.5 rounded-full flex gap-1 shadow-[4px_4px_0px_0px_rgba(58,80,107,0.3)] max-w-full overflow-x-auto scrollbar-none border-2 border-[#2D312E]">
              {CATEGORY_PILLS.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-5 md:px-7 py-2.5 rounded-full text-[9px] md:text-[10px] uppercase tracking-[0.15em] font-sans font-black transition-all duration-300 cursor-pointer whitespace-nowrap
                  ${selectedCategory === cat.value
                    ? "bg-[#3A506B] text-[#F3EFE6] scale-105 shadow-md border border-[#F3EFE6]/20"
                    : "bg-transparent text-[#F3EFE6]/70 hover:text-[#F3EFE6] hover:bg-white/5"}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* BOOK CARDS GRID */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-3 text-[#6B7280]">
            <Loader2 className="animate-spin text-[#3A506B]" size={36} />
            <p className="text-[10px] uppercase font-black tracking-[0.3em] font-sans">Unlocking book archives...</p>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="bg-[#EAE5D9]/50 border-[3px] border-dashed border-[#2D312E]/20 rounded-[35px] py-20 text-center max-w-lg mx-auto">
            <Inbox className="mx-auto text-[#6B7280] mb-3 opacity-50" size={40} />
            <p className="font-serif italic text-sm text-[#6B7280]">
              No volumes found {searchQuery ? `matching "${searchQuery}"` : `under the "${selectedCategory}" category filter`}.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredBooks.map((book) => (
                <motion.div
                  key={book._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="bg-[#FBF9F4] border-[3px] border-[#2D312E] rounded-[35px] p-6 shadow-[8px_8px_0px_0px_#2D312E] relative group h-full flex flex-col justify-between transition-transform duration-300 hover:-translate-y-2"
                >
                  {/* Category Badge */}
                  <div className="absolute -top-3 -left-3 bg-[#3A506B] text-white px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border-2 border-[#2D312E] rotate-[-5deg] z-20 shadow-md">
                    {book.category}
                  </div>

                  {/* Copies Badge */}
                  <div className="absolute -top-3 -right-3 bg-[#2D312E] text-[#F3EFE6] px-3.5 py-1 rounded-full font-black text-[9px] uppercase tracking-wider rotate-6 border-2 border-[#FBF9F4] shadow-md z-10">
                    {book.totalCopies} Copies
                  </div>

                  {/* Book Image Frame */}
                  <Link href={`/books/${book._id}`} className="w-full h-80 bg-[#EFECE6] rounded-[25px] border-2 border-[#2D312E]/15 mb-6 overflow-hidden flex items-center justify-center p-4 relative cursor-pointer shadow-inner">
                    <Image 
                      src={book.image} 
                      alt={book.title}
                      fill
                      className="object-contain p-2 group-hover:scale-105 transition-transform duration-500 rounded-[20px]"
                    />
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
                      className="w-full bg-[#2D312E] hover:bg-[#3A506B] text-[#F3EFE6] py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md text-xs font-sans uppercase tracking-widest font-bold"
                    >
                      View Details
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

      </div>
    </main>
  );
}