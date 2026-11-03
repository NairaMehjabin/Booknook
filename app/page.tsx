import { Suspense } from "react";
import Hero from "./components/Hero";
import Link from "next/link";
import Image from "next/image";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function getNewArrivals() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/books?limit=6`, {
      cache: 'no-store' 
    });
    if (!res.ok) throw new Error('Failed to fetch from backend');
    const result = await res.json();
    return result.data || [];
  } catch (error) {
    console.error("Backend offline or unreachable, using fallback items:", error);
    return []; 
  }
}

// Separate component for the async book grid wrapped in Suspense
async function NewArrivalsGrid() {
  const newArrivals = await getNewArrivals();

  if (newArrivals.length === 0) {
    return (
      <div className="text-center py-16 bg-[#EAE5D9]/50 rounded-[35px] border-[3px] border-[#2D312E]/20 max-w-md mx-auto backdrop-blur-sm">
        <p className="font-serif italic text-sm text-[#6B7280]">No books found in the archive repository. Make sure your Express server is running!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      {newArrivals.map((book: any) => (
        <div 
          key={book._id}
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
        </div>
      ))}
    </div>
  );
}

export default function Home() {
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

          {/* Suspense Boundary to satisfy Next.js 16 prerendering */}
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
              className="inline-flex items-center gap-3 bg-[#FBF9F4] text-[#2D312E] border-[3px] border-[#2D312E] px-10 py-4 rounded-full text-[11px] font-black uppercase tracking-widest shadow-[6px_6px_0px_0px_#2D312E] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#2D312E] active:translate-y-0.5 active:shadow-none transition-all"
            >
              See All Books Archive
            </Link>
          </div>
        </section>

        {/* Extra Section 1: How Borrowing Works */}
        <section className="py-20 px-6 sm:px-12 lg:px-20 border-t border-[#2D312E]/10 bg-[#EAE5D9]/30 backdrop-blur-[2px]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-3xl sm:text-4xl font-['var(--font-handwritten)'] font-bold text-[#1C242B]">
                How Borrowing <span className="text-[#3A506B]">Works</span>
              </h3>
              <p className="font-serif italic text-sm text-[#3A4045] mt-2">
                Three simple steps to enjoy and share literary histories.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-[#FBF9F4] p-8 rounded-3xl border border-[#2D312E]/20 shadow-md text-center space-y-3">
                <div className="w-12 h-12 bg-[#3A506B] text-white rounded-full flex items-center justify-center mx-auto font-bold font-serif text-lg">1</div>
                <h4 className="font-serif font-bold text-xl text-[#1C242B]">Discover & Select</h4>
                <p className="font-sans text-xs text-[#6B7280] leading-relaxed">Browse through our archive or add your own books to the community repository.</p>
              </div>
              <div className="bg-[#FBF9F4] p-8 rounded-3xl border border-[#2D312E]/20 shadow-md text-center space-y-3">
                <div className="w-12 h-12 bg-[#3A506B] text-white rounded-full flex items-center justify-center mx-auto font-bold font-serif text-lg">2</div>
                <h4 className="font-serif font-bold text-xl text-[#1C242B]">Borrow for Days</h4>
                <p className="font-sans text-xs text-[#6B7280] leading-relaxed">Secure your copy instantly. Track your active reading periods under My Borrows.</p>
              </div>
              <div className="bg-[#FBF9F4] p-8 rounded-3xl border border-[#2D312E]/20 shadow-md text-center space-y-3">
                <div className="w-12 h-12 bg-[#3A506B] text-white rounded-full flex items-center justify-center mx-auto font-bold font-serif text-lg">3</div>
                <h4 className="font-serif font-bold text-xl text-[#1C242B]">Return & Relive</h4>
                <p className="font-sans text-xs text-[#6B7280] leading-relaxed">Return the book back to the shelf so the next traveler can explore its pages.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Extra Section 2: Reader Testimonials */}
        <section className="py-20 px-6 sm:px-12 lg:px-20 border-t border-[#2D312E]/10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-3xl sm:text-4xl font-['var(--font-handwritten)'] font-bold text-[#1C242B]">
                Reader <span className="text-[#3A506B]">Reviews</span>
              </h3>
              <p className="font-serif italic text-sm text-[#3A4045] mt-2">
                Words from fellow travelers of the written word.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-[#FBF9F4] p-8 rounded-3xl border border-[#2D312E]/15 shadow-md flex flex-col justify-between">
                <p className="font-serif italic text-sm text-[#2D312E] leading-relaxed mb-6">
                  “BookNook’s vintage gazette aesthetic and seamless borrowing system make discovering classic novels an absolute joy.”
                </p>
                <div>
                  <h5 className="font-bold text-xs uppercase tracking-wider text-[#1C242B]">Naira M.</h5>
                  <p className="text-[10px] text-[#6B7280] uppercase tracking-widest font-serif">Verified Member</p>
                </div>
              </div>
              <div className="bg-[#FBF9F4] p-8 rounded-3xl border border-[#2D312E]/15 shadow-md flex flex-col justify-between">
                <p className="font-serif italic text-sm text-[#2D312E] leading-relaxed mb-6">
                  “Adding my personal library books to the archive was remarkably easy. Love the duplicate-borrow protection.”
                </p>
                <div>
                  <h5 className="font-bold text-xs uppercase tracking-wider text-[#1C242B]">Tanvir Ahmed</h5>
                  <p className="text-[10px] text-[#6B7280] uppercase tracking-widest font-serif">Contributor</p>
                </div>
              </div>
              <div className="bg-[#FBF9F4] p-8 rounded-3xl border border-[#2D312E]/15 shadow-md flex flex-col justify-between">
                <p className="font-serif italic text-sm text-[#2D312E] leading-relaxed mb-6">
                  “The capsule navbar and responsive design feel incredibly polished. A brilliant small library application!”
                </p>
                <div>
                  <h5 className="font-bold text-xs uppercase tracking-wider text-[#1C242B]">Anisa S.</h5>
                  <p className="text-[10px] text-[#6B7280] uppercase tracking-widest font-serif">Frequent Reader</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}