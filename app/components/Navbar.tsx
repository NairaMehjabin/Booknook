"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSession, signOut } from "../../lib/auth-client";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // BetterAuth session hook
  const { data: session, isPending } = useSession();
  const isLoggedIn = !!session?.user;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Safeguard: Automatically unlock body scroll on route changes or menu close
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen, pathname]);

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Logged out successfully.");
            setDropdownOpen(false);
            setMobileMenuOpen(false);
            router.push("/login");
            router.refresh();
          },
        },
      });
    } catch (error) {
      toast.error("Failed to logout.");
    }
  };

  const leftLinks = [
    { name: "Home", href: "/" },
    { name: "All Books", href: "/all-books" },
    ...(isLoggedIn ? [{ name: "Add Book", href: "/add-book" }] : []),
  ];

  const rightLinks = [
    ...(isLoggedIn ? [
      { name: "My Books", href: "/my-books" },
      { name: "My Borrows", href: "/my-borrows" }
    ] : []),
  ];

  const mobileLinks = [
    { name: "Home", href: "/" },
    { name: "All Books", href: "/all-books" },
    ...(isLoggedIn ? [
      { name: "Add Book", href: "/add-book" },
      { name: "My Books", href: "/my-books" },
      { name: "My Borrows", href: "/my-borrows" },
    ] : []),
  ];

  return (
    <>
      <nav className={`fixed w-full z-[100] transition-all duration-500 ease-in-out ${
        isScrolled ? "top-0 px-0" : "top-5 px-6"
      }`}>
        <div className={`container mx-auto relative transition-all duration-500 ${
          isScrolled ? "max-w-full" : "max-w-5xl"
        }`}>
          
          <div className={`
            flex items-center justify-between transition-all duration-500 ease-in-out
            bg-[#2D312E] shadow-xl relative
            ${isScrolled 
              ? "px-8 lg:px-16 py-2.5 rounded-none border-b border-white/10" 
              : "px-6 py-2.5 rounded-full border border-white/10"} 
          `}>
            
            {/* LEFT SECTION */}
            <div className="flex items-center gap-6 flex-1">
              <AnimatePresence mode="wait">
                {isScrolled ? (
                  <motion.div 
                    key="scrolled-logo"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <Link href="/" onClick={scrollToTop} className="flex items-center gap-2 group">
                      <div className="w-8 h-8 bg-[#FBF9F4] rounded-full flex items-center justify-center overflow-hidden border border-white/20 transition-transform group-hover:scale-110 relative">
                        <Image 
                          src="/assets/logo.png" 
                          alt="BookNook Logo" 
                          fill 
                          className="object-contain p-1"
                        />
                      </div>
                      <span className="text-lg font-['var(--font-handwritten)'] font-bold text-white tracking-wide">
                        Book<span className="text-[#3A506B]">Nook</span>
                      </span>
                    </Link>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="top-links-left"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hidden md:flex items-center gap-6"
                  >
                    {leftLinks.map((link) => (
                      <Link 
                        key={link.name} 
                        href={link.href} 
                        className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F3EFE6]/80 hover:text-white transition-colors font-serif"
                      >
                        {link.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* MOBILE HAMBURGER BUTTON */}
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden text-[#F3EFE6] hover:text-white transition-colors focus:outline-none"
                aria-label="Open menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* CENTER SECTION (Scrolled) */}
            {isScrolled && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="hidden lg:flex items-center gap-6"
              >
                {mobileLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    href={link.href} 
                    className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F3EFE6]/60 hover:text-white transition-colors font-serif"
                  >
                    {link.name}
                  </Link>
                ))}
              </motion.div>
            )}

            {!isScrolled && <div className="w-20 hidden md:block" />}

            {/* RIGHT SECTION */}
            <div className="flex items-center justify-end gap-5 md:gap-6 flex-1">
              <div className="hidden md:flex items-center gap-6">
                 {!isScrolled && rightLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    href={link.href} 
                    className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F3EFE6]/80 hover:text-white transition-colors font-serif"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
              
              {/* Auth Buttons / Profile Dropdown */}
              {isPending ? (
                <div className="w-6 h-6 rounded-full border-2 border-white/20 border-t-white animate-spin" />
              ) : !isLoggedIn ? (
                <div className="flex items-center gap-2.5">
                  <Link
                    href="/login"
                    className="text-[10px] font-bold uppercase tracking-widest font-serif px-3.5 py-1.5 rounded-full border border-white/20 hover:bg-white/10 hover:text-white transition-all text-[#F3EFE6]"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="text-[10px] font-bold uppercase tracking-widest font-serif px-4 py-1.5 rounded-full bg-[#3A506B] hover:bg-[#2C3E50] text-white transition-all shadow-md text-center"
                  >
                    Register
                  </Link>
                </div>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 focus:outline-none group"
                  >
                    <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#3A506B] shadow-md relative bg-[#FBF9F4] flex items-center justify-center">
                      {session.user.image ? (
                        <Image 
                          src={session.user.image} 
                          alt={session.user.name || "User"} 
                          fill 
                          className="object-cover" 
                        />
                      ) : (
                        <span className="text-xs font-bold text-[#2D312E]">
                          {session.user.name?.charAt(0).toUpperCase() || "U"}
                        </span>
                      )}
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2.5 w-48 bg-[#FBF9F4] text-[#2D312E] border border-[#2D312E]/20 rounded-2xl shadow-2xl py-2 z-50 text-[11px] font-serif uppercase tracking-wider">
                      <div className="px-4 py-2.5 border-b border-gray-200 text-gray-500 font-semibold truncate">
                        {session.user.name}
                      </div>
                      <Link
                        href="/my-profile"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2.5 hover:bg-[#EAE5D9] transition-colors font-bold text-[#1C242B]"
                      >
                        My Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-red-600 hover:bg-[#EAE5D9] transition-colors font-bold"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* CENTRAL LOGO (Floating Crest) */}
          <AnimatePresence>
            {!isScrolled && (
              <motion.div 
                initial={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, y: -15 }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[110]"
              >
                <Link href="/" className="relative group block">
                  <div className="absolute inset-0 bg-[#2D312E] rounded-full scale-125 shadow-lg group-hover:bg-[#3A506B] transition-colors duration-500" />
                  <div className="relative w-12 h-12 md:w-14 md:h-14 bg-[#FBF9F4] rounded-full p-1 border-3 border-[#2D312E] flex items-center justify-center overflow-hidden transition-transform duration-500 group-hover:scale-110 shadow-inner">
                    <Image 
                      src="/assets/logo.png" 
                      alt="BookNook Logo Crest" 
                      fill 
                      className="object-contain p-1.5"
                    />
                  </div>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* --- MOBILE OVERLAY MENU --- */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[200] bg-[#2D312E] flex flex-col p-6"
          >
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#FBF9F4] rounded-full relative overflow-hidden p-0.5">
                  <Image src="/assets/logo.png" alt="BookNook Logo" fill className="object-contain p-1" />
                </div>
                <span className="text-white font-['var(--font-handwritten)'] text-xl font-bold">
                  Book<span className="text-[#3A506B]">Nook</span>
                </span>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white focus:outline-none"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col gap-5">
              {mobileLinks.map((link, idx) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + idx * 0.05 }}
                >
                  <Link 
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="group flex items-center justify-between text-2xl font-serif font-bold uppercase text-[#F3EFE6] hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="mt-auto pt-6 border-t border-white/10">
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3 font-serif">Library Archive</p>
              {!isLoggedIn ? (
                <div className="flex gap-3">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="flex-1 py-3 bg-white/10 text-white hover:bg-white/20 transition-colors rounded-xl font-bold uppercase tracking-widest text-center text-xs">
                    Login
                  </Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="flex-1 py-3 bg-[#3A506B] text-white rounded-xl font-bold uppercase tracking-widest text-center text-xs">
                    Register
                  </Link>
                </div>
              ) : (
                <button onClick={handleLogout} className="w-full py-3 bg-red-600/20 text-red-400 rounded-xl font-bold uppercase tracking-widest text-center text-xs">
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}