"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Loader2, Sparkles, Bookmark, ArrowLeft, User, Mail } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  description: string;
  totalCopies: number;
  userName: string;
  userEmail: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function BookDetailPage({ params }: PageProps) {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        const resolvedParams = await params;
        const id = resolvedParams?.id;

        if (!id) return;

        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const response = await fetch(`${API_URL}/api/books/${id}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch book (Status: ${response.status})`);
        }

        const rawData = await response.json();
        const foundBook: Book = rawData.data || rawData;

        if (foundBook) {
          setBook(foundBook);
        } else {
          setError("Book record not found in our archive.");
        }
      } catch (err: any) {
        console.error("Error fetching book details:", err);
        setError("Could not retrieve book details from archive.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [params]);

  // Loading Skeleton State
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBF9F4] flex flex-col items-center justify-center font-serif text-[#1C242B] pt-28">
        <Loader2 className="animate-spin mb-4 text-[#3A506B]" size={40} />
        <p className="uppercase tracking-[0.3em] text-[10px] font-black">Unshelving volume...</p>
      </div>
    );
  }

  // Error State
  if (error || !book) {
    return (
      <div className="min-h-screen bg-[#FBF9F4] font-serif text-[#1C242B] flex flex-col items-center justify-center p-6 pt-32 text-center">
        <h2 className="text-3xl font-bold mb-4">Volume Missing</h2>
        <p className="text-sm opacity-80 mb-6 max-w-md">{error || "This book edition could not be located in our catalog."}</p>
        <Link 
          href="/" 
          className="bg-[#2D312E] text-[#F3EFE6] px-6 py-3 rounded-full text-xs uppercase tracking-widest font-black hover:bg-[#3A506B] transition-all shadow-[4px_4px_0px_0px_#2D312E] border-2 border-[#2D312E]"
        >
          Return to Archive
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF9F4] font-serif text-[#1C242B] flex flex-col relative overflow-x-hidden">
      {/* Background Decor */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-30 z-0 bg-repeat"
        style={{ backgroundImage: "url('/assets/details-bg.png')", backgroundSize: '500px auto' }}
      />

      {/* Navigation */}
      <nav className="relative z-50 pt-28 sm:pt-32 px-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <Link 
          href="/" 
          className="group flex items-center gap-3 hover:opacity-80 transition-all uppercase text-[10px] font-black tracking-widest"
        >
          <div className="w-10 h-10 border-2 border-[#2D312E] bg-[#FBF9F4] rounded-full flex items-center justify-center group-hover:bg-[#3A506B] group-hover:text-white transition-colors shadow-sm">
            <ArrowLeft size={18} />
          </div>
          <span className="bg-[#FBF9F4]/90 px-3 py-1.5 rounded-full border border-[#2D312E]/20 shadow-sm text-[#1C242B]">
            Back to Library
          </span>
        </Link>
        
        <div className="w-10 h-10 bg-[#2D312E] rounded-full flex items-center justify-center text-[#F3EFE6] shadow-md hover:scale-105 transition-transform cursor-pointer border-2 border-[#2D312E]">
          <BookOpen size={18} />
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-8 md:py-12 flex-grow w-full">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          
          {/* Visual Side (Book Frame) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="bg-[#EFECE6]/80 border-[3px] border-[#2D312E] rounded-[50px] p-8 md:p-12 aspect-square flex items-center justify-center shadow-[10px_10px_0px_0px_#2D312E] relative overflow-hidden">
              <motion.div
                animate={{ rotate: [0, 2, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                className="w-full h-full relative flex items-center justify-center"
              >
                <Image 
                  src={book.image} 
                  alt={book.title} 
                  fill
                  className="object-contain p-4 drop-shadow-2xl z-10 rounded-[20px]"
                />
              </motion.div>
            </div>
            
            {/* Copies Badge */}
            <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 bg-[#3A506B] text-white w-20 h-20 md:w-24 md:h-24 rounded-full flex flex-col items-center justify-center border-[3px] border-[#2D312E] shadow-xl rotate-12 z-20">
               <span className="text-[8px] md:text-[9px] uppercase font-black opacity-80">Available</span>
               <span className="text-lg md:text-2xl font-black">{book.totalCopies}</span>
               <span className="text-[7px] md:text-[8px] uppercase font-bold tracking-widest">Copies</span>
            </div>
          </motion.div>

          {/* Info Side */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6 md:space-y-8"
          >
            <div>
              <div className="inline-flex items-center gap-2 bg-[#3A506B] text-white border-2 border-[#2D312E] px-4 py-1.5 rounded-full text-[9px] uppercase font-black tracking-widest mb-4 md:mb-6 shadow-sm">
                <Sparkles size={12} /> {book.category} Edition ✨
              </div>
              
              <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-[#1C242B] leading-tight mb-2">
                {book.title}
              </h1>
              <p className="font-sans text-sm uppercase tracking-widest text-[#6B7280] font-bold">
                By {book.author}
              </p>
              
              <div className="h-[3px] w-20 bg-[#2D312E] opacity-20 mt-4"></div>
            </div>

            <p className="text-base md:text-lg font-sans font-medium text-[#3A4045] leading-relaxed">
              {book.description}
            </p>

            {/* Contributor Note Card */}
            <div className="bg-[#2D312E]/5 border-2 border-dashed border-[#2D312E]/20 p-5 md:p-6 rounded-3xl relative overflow-hidden">
               <div className="flex items-center gap-3 mb-2 text-[#3A506B]">
                 <User size={16} />
                 <p className="text-[10px] uppercase font-black tracking-[0.2em] text-[#1C242B]">Cataloged By:</p>
               </div>
               <p className="text-sm font-sans font-semibold text-[#1C242B]">{book.userName}</p>
               <div className="flex items-center gap-1.5 text-xs text-[#6B7280] mt-0.5">
                 <Mail size={12} />
                 <span>{book.userEmail}</span>
               </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-2">
              <button 
                disabled={book.totalCopies === 0}
                className={`flex-1 py-4 md:py-5 rounded-[25px] flex items-center justify-center gap-3 transition-all border-2 border-[#2D312E] ${
                  book.totalCopies > 0 
                    ? 'bg-[#2D312E] text-[#F3EFE6] hover:bg-[#3A506B] hover:scale-[1.02] shadow-[5px_5px_0px_0px_#3A506B] active:scale-95 cursor-pointer' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed border-gray-400'
                }`}
              >
                <BookOpen size={20} strokeWidth={2.5} />
                <span className="uppercase text-xs font-black tracking-[0.2em]">
                  {book.totalCopies > 0 ? 'Borrow This Book' : 'Not Available'}
                </span>
              </button>
              
              <button className="w-14 md:w-16 border-[3px] border-[#2D312E] rounded-[25px] flex items-center justify-center hover:bg-[#EAE5D9] transition-colors bg-[#FBF9F4]">
                <Bookmark size={20} className="text-[#2D312E]" />
              </button>
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  );
}