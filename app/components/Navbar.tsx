"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Mock authentication state (replace with actual BetterAuth session later)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [mobileMenuOpen]);

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setMobileMenuOpen(false);
  };

  const leftLinks = [
    { name: "Home", href: "/" },
    { name: "All Books", href: "/books" },
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
    { name: "All Books", href: "/books" },
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
          
          {/* --- MAIN NAVIGATION BAR (Slimmer Padding) --- */}
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
                      <div className="w-7 h-7 bg-[#FBF9F4] rounded-full flex items-center justify-center overflow-hidden border border-white/20 transition-transform group-hover:scale-110">
                        <span className="font-['var(--font-handwritten)'] text-[#3A506B] font-bold text-sm">BN</span>
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
                        className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F3EFE6]/80 hover:text-[#3A506B] transition-colors font-serif"
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
                className="md:hidden text-[#F3EFE6] hover:text-[#3A506B] transition-colors focus:outline-none"
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
                    className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F3EFE6]/60 hover:text-[#3A506B] transition-colors font-serif"
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
                    className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F3EFE6]/80 hover:text-[#3A506B] transition-colors font-serif"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
              
              {/* Auth Buttons / Profile Dropdown (Slimmer padding) */}
              {!isLoggedIn ? (
                <div className="flex items-center gap-2.5">
                  <Link
                    href="/login"
                    className="text-[10px] font-bold uppercase tracking-widest font-serif px-3.5 py-1.5 rounded-full border border-white/20 hover:bg-white/10 transition-all text-[#F3EFE6]"
                  >
                    Login
                  </Link>
                  <button
                    onClick={() => setIsLoggedIn(true)} // Toggle for preview testing
                    className="text-[10px] font-bold uppercase tracking-widest font-serif px-4 py-1.5 rounded-full bg-[#3A506B] hover:bg-[#2C3E50] text-white transition-all shadow-md"
                  >
                    Register
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 focus:outline-none"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#3A506B] shadow-sm relative bg-[#FBF9F4] flex items-center justify-center">
                      <svg className="w-4 h-4 text-[#2D312E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2.5 w-44 bg-[#FBF9F4] text-[#2D312E] border border-[#2D312E]/20 rounded-xl shadow-2xl py-2 z-50 text-[11px] font-serif uppercase tracking-wider">
                      <div className="px-3.5 py-2 border-b border-gray-200 text-gray-500 font-semibold truncate">
                        Naira Mehjabin
                      </div>
                      <Link
                        href="/my-profile"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-3.5 py-2 hover:bg-[#E5E0D0] transition-colors"
                      >
                        My Profile
                      </Link>
                      <button
                        onClick={() => {
                          setIsLoggedIn(false);
                          setDropdownOpen(false);
                        }}
                        className="w-full text-left px-3.5 py-2 text-red-600 hover:bg-[#E5E0D0] transition-colors font-bold"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* CENTRAL LOGO (Floating Crest - Slimmer sizing) */}
          <AnimatePresence>
            {!isScrolled && (
              <motion.div 
                initial={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, y: -15 }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[110]"
              >
                <Link href="/" className="relative group block">
                  <div className="absolute inset-0 bg-[#2D312E] rounded-full scale-125 shadow-lg group-hover:bg-[#3A506B] transition-colors duration-500" />
                  <div className="relative w-12 h-12 md:w-14 md:h-14 bg-[#FBF9F4] rounded-full p-0.5 border-3 border-[#2D312E] flex items-center justify-center overflow-hidden transition-transform duration-500 group-hover:scale-110 shadow-inner">
                    <span className="font-['var(--font-handwritten)'] text-[#2D312E] text-xl font-bold">BN</span>
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
            {/* Close Button Header */}
            <div className="flex justify-between items-center mb-8">
              <span className="text-white font-['var(--font-handwritten)'] text-xl font-bold">
                Book<span className="text-[#3A506B]">Nook</span>
              </span>

              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white focus:outline-none"
                aria-label="Close menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mobile Links */}
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
                    className="group flex items-center justify-between text-2xl font-serif font-bold uppercase text-[#F3EFE6] hover:text-[#3A506B] transition-colors"
                  >
                    {link.name}
                    <svg className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Footer info in Menu */}
            <div className="mt-auto pt-6 border-t border-white/10">
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3 font-serif">A Small Online Library Archive</p>
              {!isLoggedIn ? (
                <div className="flex gap-3">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="flex-1 py-3 bg-white/10 text-white rounded-xl font-bold uppercase tracking-widest text-center text-xs">
                    Login
                  </Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="flex-1 py-3 bg-[#3A506B] text-white rounded-xl font-bold uppercase tracking-widest text-center text-xs">
                    Register
                  </Link>
                </div>
              ) : (
                <button onClick={() => { setIsLoggedIn(false); setMobileMenuOpen(false); }} className="w-full py-3 bg-red-600/20 text-red-400 rounded-xl font-bold uppercase tracking-widest text-center text-xs">
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