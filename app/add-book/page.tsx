"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Sparkles, ArrowRight, BookPlus, Image as ImageIcon, Layers, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AddBookPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "Fiction",
    image: "",
    description: "",
    totalCopies: 1,
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("You must be logged in to add a book.");
      router.push("/login");
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading("Cataloging new book into archive...", {
      style: { background: "#2D312E", color: "#F3EFE6", borderRadius: "1rem" },
    });

    try {
      const bookPayload = {
        ...formData,
        totalCopies: Number(formData.totalCopies),
        userName: user.name || "Anonymous Reader",
        userEmail: user.email || "reader@booknook.com",
      };

      const res = await fetch(`${API_BASE_URL}/api/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookPayload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add book.");
      }

      toast.success("Book successfully added to archive! 📚", { id: toastId });
      router.push("/books");
      router.refresh();
    } catch (err: any) {
      setSubmitting(false);
      toast.error(err.message || "Server error while adding book.", { id: toastId });
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-[#FBF9F4] flex items-center justify-center font-serif text-[#1C242B]">
        <p className="text-xs uppercase tracking-widest text-[#6B7280]">Loading access permissions...</p>
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <main className="min-h-screen bg-[#FBF9F4] text-[#1C242B] py-24 px-6 md:px-12 relative overflow-hidden font-serif">
      
      {/* Background Vintage Texture */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-30 z-0 bg-repeat"
        style={{ backgroundImage: "url('/assets/details-bg.png')", backgroundSize: '500px auto' }}
      />

      <div className="max-w-2xl mx-auto relative z-10 space-y-8 pt-12 sm:pt-16">
        
        {/* BACK TO HOME BUTTON */}
        <div>
          <Link 
            href="/" 
            className="group inline-flex items-center gap-3 hover:opacity-80 transition-all uppercase text-[10px] font-black tracking-widest"
          >
            <div className="w-10 h-10 border-2 border-[#2D312E] bg-[#FBF9F4] rounded-full flex items-center justify-center group-hover:bg-[#3A506B] group-hover:text-white transition-colors shadow-sm">
              <ArrowLeft size={18} />
            </div>
            <span className="bg-[#FBF9F4]/90 px-3 py-1.5 rounded-full border border-[#2D312E]/20 shadow-sm text-[#1C242B]">
              Back to Home
            </span>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-[#FBF9F4] border-[3px] border-[#2D312E] rounded-[35px] p-8 sm:p-12 shadow-[10px_10px_0px_0px_#2D312E] relative"
        >
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#3A506B] text-white text-[9px] uppercase tracking-widest font-black mb-3 border border-[#2D312E]">
              <Sparkles size={10} /> Contribution Portal
            </div>
            <h1 className="text-4xl sm:text-5xl font-['var(--font-handwritten)'] font-bold text-[#1C242B]">
              Add a New <span className="text-[#3A506B]">Book</span>
            </h1>
            <p className="font-serif italic text-xs sm:text-sm text-[#6B7280] mt-1">
              Share a chapter of history with fellow travelers of the written word.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 font-sans">
            
            {/* Title & Author */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-[#2D312E] uppercase tracking-widest mb-1.5 ml-1">
                  Book Title
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Kabuliwala"
                  className="w-full px-4 py-3 rounded-2xl bg-[#EFECE6]/50 border-2 border-[#2D312E]/20 focus:border-[#2D312E] text-xs font-semibold text-[#1C242B] outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-[#2D312E] uppercase tracking-widest mb-1.5 ml-1">
                  Author Name
                </label>
                <input
                  type="text"
                  name="author"
                  required
                  value={formData.author}
                  onChange={handleChange}
                  placeholder="e.g., Rabindranath Tagore"
                  className="w-full px-4 py-3 rounded-2xl bg-[#EFECE6]/50 border-2 border-[#2D312E]/20 focus:border-[#2D312E] text-xs font-semibold text-[#1C242B] outline-none transition-all"
                />
              </div>
            </div>

            {/* Category & Total Copies */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-[#2D312E] uppercase tracking-widest mb-1.5 ml-1">
                  Category
                </label>
                <div className="relative">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-2xl bg-[#EFECE6]/50 border-2 border-[#2D312E]/20 focus:border-[#2D312E] text-xs font-semibold text-[#1C242B] outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="Fiction">Fiction</option>
                    <option value="Science">Science</option>
                    <option value="History">History</option>
                    <option value="Kids">Kids</option>
                    <option value="Others">Others</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-[#6B7280]">
                    <Layers size={14} />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-[#2D312E] uppercase tracking-widest mb-1.5 ml-1">
                  Total Copies
                </label>
                <input
                  type="number"
                  name="totalCopies"
                  min="1"
                  required
                  value={formData.totalCopies}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl bg-[#EFECE6]/50 border-2 border-[#2D312E]/20 focus:border-[#2D312E] text-xs font-semibold text-[#1C242B] outline-none transition-all"
                />
              </div>
            </div>

            {/* Book Image URL */}
            <div>
              <label className="block text-[10px] font-black text-[#2D312E] uppercase tracking-widest mb-1.5 ml-1">
                Book Cover Image URL (ImgBB / Unsplash)
              </label>
              <div className="relative rounded-2xl bg-[#EFECE6]/50 border-2 border-[#2D312E]/20 focus-within:border-[#2D312E] transition-all overflow-hidden">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#6B7280]">
                  <ImageIcon size={16} />
                </div>
                <input
                  type="url"
                  name="image"
                  required
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://i.ibb.co/... or image link"
                  className="w-full pl-11 pr-4 py-3 text-xs font-semibold text-[#1C242B] bg-transparent outline-none"
                />
              </div>
            </div>

            {/* Short Description */}
            <div>
              <label className="block text-[10px] font-black text-[#2D312E] uppercase tracking-widest mb-1.5 ml-1">
                Short Description / Summary
              </label>
              <textarea
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Write a brief overview of the book's narrative..."
                className="w-full px-4 py-3 rounded-2xl bg-[#EFECE6]/50 border-2 border-[#2D312E]/20 focus:border-[#2D312E] text-xs font-semibold text-[#1C242B] outline-none transition-all resize-none"
              />
            </div>

            {/* Read-Only User Info (Auto-populated) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#2D312E]/10">
              <div>
                <label className="block text-[9px] font-bold text-[#6B7280] uppercase tracking-widest mb-1 ml-1">
                  Contributor Name (Read-Only)
                </label>
                <input
                  type="text"
                  disabled
                  value={user.name || ""}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#EFECE6]/30 border border-[#2D312E]/10 text-xs font-semibold text-[#6B7280] cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-[#6B7280] uppercase tracking-widest mb-1 ml-1">
                  Contributor Email (Read-Only)
                </label>
                <input
                  type="email"
                  disabled
                  value={user.email || ""}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#EFECE6]/30 border border-[#2D312E]/10 text-xs font-semibold text-[#6B7280] cursor-not-allowed"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-[#2D312E] hover:bg-[#3A506B] text-[#F3EFE6] rounded-2xl font-bold text-xs tracking-widest uppercase shadow-[4px_4px_0px_0px_#3A506B] transition-all mt-4 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 border-2 border-[#2D312E]"
            >
              {submitting ? "Cataloging Book..." : (
                <>
                  <BookPlus size={16} /> Add Book to Archive <ArrowRight size={15} />
                </>
              )}
            </button>

          </form>
        </motion.div>
      </div>
    </main>
  );
}