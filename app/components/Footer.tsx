"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, Compass, Scroll, Heart, Send, UserCheck, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { useSession } from "@/lib/auth-client";

export default function Footer() {
  const { data: session } = useSession();
  const user = session?.user;

  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [currentYear, setCurrentYear] = useState<number | string>("2026");

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSubscribed(true);
    toast.success("Added to the Gazette subscriber roll! 📜", {
      style: { background: "#2D312E", color: "#F3EFE6", borderRadius: "1rem" },
    });
    setEmail("");
  };

  return (
    <footer className="bg-[#2D312E] text-[#F3EFE6] pt-20 pb-12 px-6 sm:px-12 lg:px-20 border-t-[4px] border-[#1C242B] relative overflow-hidden font-serif">
      
      {/* Background Texture Overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#F3EFE6_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-16">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          
          {/* Col 1: Brand & Lore */}
          <div className="md:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#3A506B] text-[#F3EFE6] text-[9px] uppercase tracking-[0.2em] font-black border border-white/10">
              <Sparkles size={10} /> Established 2025 • Gazette Vol. IV
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FBF9F4] rounded-full relative overflow-hidden p-1 border-2 border-white/20 shadow-md">
                <Image 
                  src="/assets/logo.png" 
                  alt="BookNook Logo" 
                  fill 
                  className="object-contain p-1"
                />
              </div>
              <h2 className="text-4xl font-['var(--font-handwritten)'] font-bold tracking-tight text-[#FBF9F4]">
                BookNook<span className="text-[#C86228]">.</span>
              </h2>
            </div>

            <p className="font-serif italic text-xs sm:text-sm text-[#EFECE6]/70 leading-relaxed max-w-sm">
              “A small online sanctuary where stories are shared, margins are filled with secret thoughts, and every volume finds a temporary home.”
            </p>

            <div className="pt-2 flex items-center gap-3 text-xs font-sans text-[#EFECE6]/60">
              <span className="inline-flex items-center gap-1.5">
                <Compass size={14} className="text-[#C86228]" /> Rajshahi Scriptorium
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1.5">
                <Scroll size={14} className="text-[#C86228]" /> Open Archive
              </span>
            </div>
          </div>

          {/* Col 2: Navigation (Dynamic per Auth State) */}
          <div className="md:col-span-3 space-y-4 font-sans">
            <h3 className="text-[10px] uppercase tracking-[0.25em] font-black text-[#F3EFE6]/50">
              {user ? "Member Portal" : "Library Navigation"}
            </h3>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li>
                <Link href="/" className="hover:text-[#C86228] transition-colors inline-flex items-center gap-2">
                  <span>▸</span> Home
                </Link>
              </li>
              <li>
                <Link href="/all-books" className="hover:text-[#C86228] transition-colors inline-flex items-center gap-2">
                  <span>▸</span> All Books
                </Link>
              </li>
              
              {/* Protected Route Links */}
              {user ? (
                <>
                  <li>
                    <Link href="/my-books" className="hover:text-[#C86228] transition-colors inline-flex items-center gap-2 text-[#FBF9F4]">
                      <span className="text-[#C86228]">▸</span> My Books
                    </Link>
                  </li>
                  <li>
                    <Link href="/my-borrows" className="hover:text-[#C86228] transition-colors inline-flex items-center gap-2 text-[#FBF9F4]">
                      <span className="text-[#C86228]">▸</span> My Borrows
                    </Link>
                  </li>
                  <li>
                    <Link href="/add-book" className="hover:text-[#C86228] transition-colors inline-flex items-center gap-2">
                      <span>▸</span> Add A Book
                    </Link>
                  </li>
                  <li>
                    <Link href="/my-profile" className="hover:text-[#C86228] transition-colors inline-flex items-center gap-2 text-[#EFECE6]/80">
                      <span>▸</span> Profile
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link href="/login" className="hover:text-[#C86228] transition-colors inline-flex items-center gap-2">
                      <span>▸</span> Member Login
                    </Link>
                  </li>
                  <li>
                    <Link href="/register" className="hover:text-[#C86228] transition-colors inline-flex items-center gap-2">
                      <span>▸</span> Register Account
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Col 3: Reader Status or Dispatch Form */}
          <div className="md:col-span-4 space-y-4 font-sans">
            {user ? (
              <div className="bg-[#1C242B]/80 border border-white/10 rounded-2xl p-5 space-y-3 shadow-inner">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-widest font-black text-[#C86228] inline-flex items-center gap-1.5">
                    <UserCheck size={13} /> Active Session
                  </span>
                  <span className="text-[9px] bg-green-900/40 text-green-300 border border-green-700/40 px-2 py-0.5 rounded-full font-mono">
                    AUTHENTICATED
                  </span>
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-[#FBF9F4] line-clamp-1">
                    {user.name}
                  </h4>
                  <p className="text-xs text-[#EFECE6]/60 truncate font-mono">
                    {user.email}
                  </p>
                </div>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-[#EFECE6]/60">
                  <span>Access Level: Contributor</span>
                  <Link href="/my-profile" className="text-[#C86228] font-bold hover:underline">
                    View Profile →
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-[10px] uppercase tracking-[0.25em] font-black text-[#F3EFE6]/50 mb-2">
                  The Gazette Dispatch
                </h3>
                <p className="text-xs text-[#EFECE6]/70 font-serif italic leading-relaxed">
                  Receive weekly updates on newly cataloged first editions, secret margin notes, and archive lore.
                </p>

                <form onSubmit={handleSubscribe} className="space-y-2 pt-3">
                  <div className="relative rounded-2xl bg-[#1C242B] border-2 border-white/15 focus-within:border-[#C86228] transition-all overflow-hidden flex items-center">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your reader email..."
                      className="w-full px-4 py-3 text-xs font-semibold text-[#F3EFE6] bg-transparent outline-none placeholder-[#EFECE6]/40"
                    />
                    <button
                      type="submit"
                      className="bg-[#3A506B] hover:bg-[#C86228] text-white px-4 py-3 transition-colors cursor-pointer flex items-center justify-center"
                    >
                      <Send size={15} />
                    </button>
                  </div>
                  {subscribed && (
                    <p className="text-[10px] text-[#C86228] font-sans tracking-wide font-bold">
                      ✓ Successfully registered for the weekly dispatch.
                    </p>
                  )}
                </form>
              </div>
            )}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-xs text-[#EFECE6]/60">
          <p className="text-center sm:text-left">
            &copy; {currentYear} BookNook Archive. Crafted with <Heart size={12} className="inline text-[#C86228] fill-[#C86228] mx-0.5" /> for traveling readers.
          </p>

          <div className="flex items-center gap-6">
            <span className="text-[10px] font-mono tracking-widest text-[#EFECE6]/40 uppercase inline-flex items-center gap-1.5">
              <ShieldCheck size={12} className="text-[#C86228]" /> Status: {user ? "Member Logged In" : "Public Archives"}
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}