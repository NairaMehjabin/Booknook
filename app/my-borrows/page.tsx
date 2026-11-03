"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, RotateCcw, Calendar, BookOpen, Clock, Loader2, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface BorrowedItem {
  _id: string;
  bookId: string;
  bookTitle: string;
  bookImage: string;
  userEmail: string;
  userName: string;
  borrowDate: string;
  returnDate: string;
}

export default function MyBorrowsPage() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();
  const user = session?.user;

  // Immediate title update to prevent stalling
  if (typeof window !== "undefined") {
    document.title = "BookNook | My Borrowed Volumes";
  }

  const [borrows, setBorrows] = useState<BorrowedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "BookNook | My Borrowed Volumes";
    const fetchBorrows = async () => {
      if (!user?.email) return;
      try {
        const res = await fetch(`${API_BASE_URL}/api/borrows?email=${user.email}`);
        const result = await res.json();
        if (res.ok) {
          setBorrows(result.data || []);
        } else {
          toast.error("Failed to retrieve your borrowed catalog.");
        }
      } catch (err) {
        console.error("Error fetching borrows:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBorrows();
    }
  }, [user]);

  const handleReturnBook = async (borrowId: string) => {
    if (!window.confirm("Are you sure you wish to return this volume to the library archive?")) return;

    const toastId = toast.loading("Returning volume to archive...", {
      style: { background: "#2D312E", color: "#F3EFE6", borderRadius: "1rem" },
    });

    try {
      const res = await fetch(`${API_BASE_URL}/api/borrows/${borrowId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to return book.");

      setBorrows((prev) => prev.filter((b) => b._id !== borrowId));
      toast.success("Volume successfully returned! 📚✨", { id: toastId });
    } catch (err: any) {
      toast.error(err.message || "Error returning book.", { id: toastId });
    }
  };

  if (sessionLoading || loading) {
    return (
      <div className="min-h-screen bg-[#FBF9F4] flex flex-col items-center justify-center font-serif text-[#1C242B] pt-28">
        <Loader2 className="animate-spin mb-4 text-[#3A506B]" size={40} />
        <p className="text-xs uppercase tracking-[0.25em] text-[#6B7280]">Accessing reader borrowing records...</p>
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FBF9F4] text-[#1C242B] px-4 sm:px-6 md:px-12 py-24 font-serif relative overflow-hidden">
      {/* Background Vintage Texture */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-20 z-0 bg-repeat"
        style={{ backgroundImage: "url('/assets/details-bg.png')", backgroundSize: '500px auto' }}
      />

      {/* Main Container with top padding inside so it clears the fixed navbar */}
      <div className="max-w-7xl mx-auto relative z-10 space-y-10 pt-12 sm:pt-16">
        
        {/* BACK TO LIBRARY BUTTON */}
        <div className="pt-6">
          <Link 
            href="/" 
            className="group inline-flex items-center gap-3 hover:opacity-80 transition-all uppercase text-[10px] font-black tracking-widest"
          >
            <div className="w-10 h-10 border-2 border-[#2D312E] bg-[#FBF9F4] rounded-full flex items-center justify-center group-hover:bg-[#3A506B] group-hover:text-white transition-colors shadow-sm">
              <ArrowLeft size={18} />
            </div>
            <span className="bg-[#FBF9F4]/90 px-3 py-1.5 rounded-full border border-[#2D312E]/20 shadow-sm text-[#1C242B]">
              Back to Library
            </span>
          </Link>
        </div>

        {/* HEADER */}
        <header className="border-b border-[#2D312E]/15 pb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#3A506B]/10 text-[#3A506B] text-[10px] uppercase tracking-[0.2em] font-semibold border border-[#3A506B]/20">
              <Sparkles size={11} /> Reader Dashboard
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#1C242B] tracking-tight">
              My Borrowed <span className="italic font-normal text-[#3A506B]">Volumes</span>
            </h1>
            <p className="text-[#6B7280] font-serif text-xs sm:text-sm max-w-xl leading-relaxed">
              Track your active borrowings, due dates, and return volumes back to the community collection.
            </p>
          </div>

          <Link
            href="/books"
            className="bg-[#2D312E] hover:bg-[#3A506B] text-[#F3EFE6] px-5 py-3.5 rounded-xl font-sans text-xs uppercase tracking-[0.15em] font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-sm hover:shadow-md border border-[#2D312E] w-full sm:w-fit"
          >
            <BookOpen size={15} /> Browse More Books
          </Link>
        </header>

        {/* BORROWED BOOKS GRID */}
        {borrows.length === 0 ? (
          <div className="bg-[#FBF9F4] rounded-2xl border border-dashed border-[#2D312E]/20 p-10 sm:p-16 text-center">
            <p className="text-xl sm:text-2xl font-serif text-[#1C242B]">
              You currently have no borrowed volumes.
            </p>
            <p className="text-[#6B7280] font-serif italic text-xs mt-2">
              Explore the library collection to borrow your next read.
            </p>
            <Link
              href="/books"
              className="inline-flex items-center gap-2 bg-[#2D312E] text-[#F3EFE6] px-5 py-3 rounded-xl text-xs font-sans uppercase tracking-[0.15em] font-semibold shadow-sm mt-6 border border-[#2D312E]"
            >
              <BookOpen size={15} /> Explore Archive
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {borrows.map((borrow) => (
              <motion.div
                key={borrow._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-[#FBF9F4] border border-[#2D312E]/15 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group p-5"
              >
                <div>
                  {/* Cover Image Frame */}
                  <div className="w-full h-56 sm:h-60 bg-[#EFECE6]/60 rounded-xl border border-[#2D312E]/10 overflow-hidden flex items-center justify-center p-3 relative shadow-inner mb-4">
                    <Image
                      src={borrow.bookImage}
                      alt={borrow.bookTitle}
                      fill
                      className="object-contain p-2 group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  </div>

                  {/* Details */}
                  <div className="space-y-3 font-sans">
                    <h3 className="text-lg sm:text-xl font-bold font-serif text-[#1C242B] tracking-tight line-clamp-1">
                      {borrow.bookTitle}
                    </h3>

                    <div className="bg-[#EFECE6]/40 p-3.5 rounded-xl border border-[#2D312E]/10 space-y-2 text-xs">
                      <div className="flex items-center justify-between text-[#6B7280]">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Calendar size={13} className="text-[#3A506B]" /> Borrow Date:
                        </span>
                        <span className="font-semibold text-[#1C242B]">{borrow.borrowDate}</span>
                      </div>
                      <div className="flex items-center justify-between text-[#6B7280] border-t border-[#2D312E]/10 pt-2">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Clock size={13} className="text-[#3A506B]" /> Return By:
                        </span>
                        <span className="font-bold text-[#3A506B]">{borrow.returnDate}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Return Button */}
                <div className="pt-4 mt-4 border-t border-[#2D312E]/10 font-sans">
                  <button
                    onClick={() => handleReturnBook(borrow._id)}
                    className="w-full bg-[#3A506B] hover:bg-[#2C3E50] text-[#F3EFE6] py-3 rounded-xl flex items-center justify-center gap-2 transition-all text-xs uppercase tracking-[0.1em] font-semibold shadow-sm cursor-pointer border border-[#2D312E]/20"
                  >
                    <RotateCcw size={14} /> Return Book
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}