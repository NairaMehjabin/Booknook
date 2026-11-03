"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Edit3,
  Trash2,
  X,
  BookOpen,
  Search,
  Plus,
  BookPlus,
  ArrowUpRight,
  ArrowLeft
} from "lucide-react";
import toast from "react-hot-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function MyBooksPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;

  // Immediate title update to prevent stalling
  if (typeof window !== "undefined") {
    document.title = "BookNook | My Catalogued Volumes";
  }

  const [myBooks, setMyBooks] = useState<any[]>([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Edit Modal State
  const [editingBook, setEditingBook] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    author: "",
    category: "Fiction",
    image: "",
    description: "",
    totalCopies: 1,
  });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    document.title = "BookNook | My Catalogued Volumes";
    const fetchMyBooks = async () => {
      if (!user?.email) return;
      try {
        const res = await fetch(`${API_BASE_URL}/api/books/user/${user.email}`);
        const result = await res.json();
        if (res.ok) {
          setMyBooks(result.data || []);
        } else {
          toast.error("Failed to load your catalog.");
        }
      } catch (error) {
        console.error("Error fetching user books:", error);
      } finally {
        setLoadingBooks(false);
      }
    };

    if (user) {
      fetchMyBooks();
    }
  }, [user]);

  // Filter books by search query
  const filteredBooks = myBooks.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalListings = myBooks.length;
  const totalCopiesSum = myBooks.reduce((acc, curr) => acc + (Number(curr.totalCopies) || 0), 0);
  const uniqueCategories = new Set(myBooks.map((b) => b.category)).size;

  const handleOpenEdit = (book: any) => {
    setEditingBook(book);
    setEditForm({
      title: book.title,
      author: book.author,
      category: book.category,
      image: book.image,
      description: book.description,
      totalCopies: book.totalCopies,
    });
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBook) return;

    setUpdating(true);
    const toastId = toast.loading("Updating volume entry...", {
      style: { background: "#2D312E", color: "#F3EFE6", borderRadius: "0.75rem" },
    });

    try {
      const res = await fetch(`${API_BASE_URL}/api/books/${editingBook._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Update failed.");

      setMyBooks((prev) =>
        prev.map((b) => (b._id === editingBook._id ? result.data : b))
      );
      toast.success("Volume updated gracefully.", { id: toastId });
      setEditingBook(null);
    } catch (err: any) {
      toast.error(err.message || "Error updating book.", { id: toastId });
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (bookId: string) => {
    if (!window.confirm("Are you sure you want to remove this volume from the archive?")) return;

    const toastId = toast.loading("De-cataloging volume...", {
      style: { background: "#2D312E", color: "#F3EFE6", borderRadius: "0.75rem" },
    });

    try {
      const res = await fetch(`${API_BASE_URL}/api/books/${bookId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete book.");

      setMyBooks((prev) => prev.filter((b) => b._id !== bookId));
      toast.success("Volume removed from collection.", { id: toastId });
    } catch (err: any) {
      toast.error(err.message || "Error deleting book.", { id: toastId });
    }
  };

  if (isPending || loadingBooks) {
    return (
      <div className="min-h-screen bg-[#FBF9F4] flex items-center justify-center font-serif text-[#1C242B]">
        <p className="text-xs uppercase tracking-[0.25em] text-[#6B7280]">Retrieving literary archives...</p>
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FBF9F4] text-[#1C242B] p-6 md:p-12 pt-36 font-serif relative overflow-hidden">
      
      {/* Background Vintage Texture */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-20 z-0 bg-repeat"
        style={{ backgroundImage: "url('/assets/details-bg.png')", backgroundSize: '400px auto' }}
      />

      <div className="max-w-7xl mx-auto relative z-10 space-y-10">
        
        {/* BACK TO LIBRARY BUTTON */}
        <div className="pt-24 sm:pt-28">
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

        {/* ELEGANT HEADER */}
        <header className="border-b border-[#2D312E]/10 pb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3A506B]/10 text-[#3A506B] text-[10px] uppercase tracking-[0.2em] font-semibold border border-[#3A506B]/20">
              <Sparkles size={11} /> Personal Archive
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#1C242B] tracking-tight">
              My Catalogued <span className="italic font-normal text-[#3A506B]">Volumes</span>
            </h1>
            <p className="text-[#6B7280] font-serif text-sm max-w-xl leading-relaxed">
              Curate, update, and manage the literary works you have contributed to BookNook's shared collection.
            </p>
          </div>

          <Link
            href="/add-book"
            className="bg-[#2D312E] hover:bg-[#3A506B] text-[#F3EFE6] px-5 py-3.5 rounded-xl font-sans text-xs uppercase tracking-[0.15em] font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-sm hover:shadow-md border border-[#2D312E]"
          >
            <Plus size={15} /> Catalog New Volume
          </Link>
        </header>

        {/* REFINED STATS BANNER */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-[#FBF9F4] rounded-2xl border border-[#2D312E]/15 p-6 shadow-sm flex flex-col justify-between">
            <span className="text-[10px] uppercase tracking-[0.2em] font-sans font-bold text-[#6B7280]">
              Titles Contributed
            </span>
            <div className="text-3xl font-serif font-bold text-[#1C242B] mt-3">
              {totalListings}
            </div>
          </div>

          <div className="bg-[#3A506B]/5 rounded-2xl border border-[#3A506B]/20 p-6 shadow-sm flex flex-col justify-between">
            <span className="text-[10px] uppercase tracking-[0.2em] font-sans font-bold text-[#3A506B]">
              Total Available Copies
            </span>
            <div className="text-3xl font-serif font-bold text-[#3A506B] mt-3">
              {totalCopiesSum}
            </div>
          </div>

          <div className="bg-[#EFECE6]/70 rounded-2xl border border-[#2D312E]/15 p-6 shadow-sm flex flex-col justify-between">
            <span className="text-[10px] uppercase tracking-[0.2em] font-sans font-bold text-[#6B7280]">
              Genres Covered
            </span>
            <div className="text-3xl font-serif font-bold text-[#1C242B] mt-3">
              {uniqueCategories}
            </div>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="bg-[#FBF9F4] border border-[#2D312E]/15 rounded-2xl p-2 sm:p-3 shadow-sm">
          <div className="relative w-full flex items-center">
            <Search className="absolute left-4 text-[#6B7280]" size={16} />
            <input
              type="text"
              placeholder="Search your collection by title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#EFECE6]/40 border border-[#2D312E]/10 rounded-xl pl-11 pr-4 py-2.5 outline-none focus:border-[#3A506B] focus:bg-white transition-all text-xs font-sans text-[#1C242B] placeholder-[#6B7280]/60"
            />
          </div>
        </div>

        {/* ELEGANT BOOKS GRID */}
        {filteredBooks.length === 0 ? (
          <div className="bg-[#FBF9F4] rounded-2xl border border-dashed border-[#2D312E]/20 p-16 text-center">
            <p className="text-xl font-serif text-[#1C242B]">
              {myBooks.length === 0 ? "Your catalog is currently empty." : "No matching volumes found."}
            </p>
            <p className="text-[#6B7280] font-serif italic text-xs mt-2">
              {myBooks.length === 0 ? "Begin adding books to enrich the reader's archive." : "Refine your search parameters."}
            </p>
            {myBooks.length === 0 && (
              <Link
                href="/add-book"
                className="inline-flex items-center gap-2 bg-[#2D312E] text-[#F3EFE6] px-5 py-3 rounded-xl text-xs font-sans uppercase tracking-[0.15em] font-semibold shadow-sm mt-6 border border-[#2D312E]"
              >
                <BookPlus size={15} /> Add First Volume
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBooks.map((book) => (
              <motion.div
                key={book._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-[#FBF9F4] border border-[#2D312E]/15 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group p-5"
              >
                <div>
                  {/* Category & Copies Badges */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-[#3A506B]/10 text-[#3A506B] border border-[#3A506B]/20 px-3 py-0.5 rounded-full text-[9px] font-sans font-bold uppercase tracking-[0.15em]">
                      {book.category}
                    </span>
                    <span className="text-[#6B7280] text-[10px] font-sans font-semibold tracking-wider">
                      {book.totalCopies} {book.totalCopies === 1 ? "copy" : "copies"} available
                    </span>
                  </div>

                  {/* Clickable Image & Content */}
                  <Link href={`/books/${book._id}`} className="block group/link space-y-4">
                    <div className="w-full h-56 bg-[#EFECE6]/60 rounded-xl border border-[#2D312E]/10 overflow-hidden flex items-center justify-center p-3 relative shadow-inner group-hover/link:border-[#3A506B]/40 transition-colors">
                      <Image
                        src={book.image}
                        alt={book.title}
                        fill
                        className="object-contain p-2 group-hover/link:scale-105 transition-transform duration-500 ease-out"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-xl font-bold font-serif text-[#1C242B] tracking-tight line-clamp-1 group-hover/link:text-[#3A506B] transition-colors">
                          {book.title}
                        </h3>
                        <ArrowUpRight size={16} className="text-[#6B7280] opacity-0 group-hover/link:opacity-100 transition-opacity shrink-0" />
                      </div>
                      <p className="text-xs font-sans text-[#6B7280] uppercase tracking-wider font-semibold">
                        By {book.author}
                      </p>
                      <p className="text-xs text-[#6B7280] line-clamp-2 font-serif italic pt-1 leading-relaxed">
                        "{book.description}"
                      </p>
                    </div>
                  </Link>
                </div>

                {/* Elegant Action Buttons */}
                <div className="space-y-2 font-sans pt-5 mt-4 border-t border-[#2D312E]/10">
                  <Link
                    href={`/books/${book._id}`}
                    className="w-full bg-[#EFECE6]/60 hover:bg-[#EFECE6] text-[#1C242B] py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all text-xs uppercase tracking-[0.1em] font-semibold border border-[#2D312E]/15"
                  >
                    <BookOpen size={13} className="text-[#3A506B]" /> View Entry
                  </Link>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleOpenEdit(book)}
                      className="bg-[#3A506B] hover:bg-[#2C3E50] text-[#F3EFE6] py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all text-xs uppercase tracking-[0.1em] font-semibold shadow-sm cursor-pointer"
                    >
                      <Edit3 size={13} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(book._id)}
                      className="bg-[#8B3A3A]/10 hover:bg-[#8B3A3A] text-[#8B3A3A] hover:text-[#F3EFE6] border border-[#8B3A3A]/30 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all text-xs uppercase tracking-[0.1em] font-semibold cursor-pointer"
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {editingBook && (
          <div className="fixed inset-0 z-50 bg-[#1C242B]/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              className="bg-[#FBF9F4] w-full max-w-xl rounded-2xl border border-[#2D312E]/20 shadow-xl p-8 sm:p-10 relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setEditingBook(null)}
                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-[#EFECE6] border border-[#2D312E]/15 flex items-center justify-center text-[#1C242B] hover:bg-[#2D312E] hover:text-white transition-colors cursor-pointer"
              >
                <X size={15} />
              </button>

              <div className="mb-6 space-y-1">
                <span className="text-[10px] uppercase tracking-[0.2em] font-sans font-bold text-[#3A506B]">
                  Catalog Modification
                </span>
                <h2 className="text-2xl font-bold font-serif text-[#1C242B]">
                  Edit Volume Details
                </h2>
              </div>

              <form onSubmit={handleUpdateSubmit} className="space-y-4 font-sans">
                <div>
                  <label className="block text-[10px] font-bold text-[#2D312E] uppercase tracking-[0.15em] mb-1.5 ml-0.5">
                    Book Title
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#EFECE6]/50 border border-[#2D312E]/20 focus:border-[#3A506B] focus:bg-white text-xs font-medium text-[#1C242B] outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-[#2D312E] uppercase tracking-[0.15em] mb-1.5 ml-0.5">
                      Author Name
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.author}
                      onChange={(e) => setEditForm({ ...editForm, author: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#EFECE6]/50 border border-[#2D312E]/20 focus:border-[#3A506B] focus:bg-white text-xs font-medium text-[#1C242B] outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#2D312E] uppercase tracking-[0.15em] mb-1.5 ml-0.5">
                      Category
                    </label>
                    <select
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#EFECE6]/50 border border-[#2D312E]/20 focus:border-[#3A506B] focus:bg-white text-xs font-medium text-[#1C242B] outline-none transition-all cursor-pointer"
                    >
                      <option value="Fiction">Fiction</option>
                      <option value="Science">Science</option>
                      <option value="History">History</option>
                      <option value="Kids">Kids</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-[#2D312E] uppercase tracking-[0.15em] mb-1.5 ml-0.5">
                      Total Copies
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={editForm.totalCopies}
                      onChange={(e) => setEditForm({ ...editForm, totalCopies: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#EFECE6]/50 border border-[#2D312E]/20 focus:border-[#3A506B] focus:bg-white text-xs font-medium text-[#1C242B] outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#2D312E] uppercase tracking-[0.15em] mb-1.5 ml-0.5">
                      Cover Image URL
                    </label>
                    <input
                      type="url"
                      required
                      value={editForm.image}
                      onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#EFECE6]/50 border border-[#2D312E]/20 focus:border-[#3A506B] focus:bg-white text-xs font-medium text-[#1C242B] outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#2D312E] uppercase tracking-[0.15em] mb-1.5 ml-0.5">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#EFECE6]/50 border border-[#2D312E]/20 focus:border-[#3A506B] focus:bg-white text-xs font-medium text-[#1C242B] outline-none transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={updating}
                  className="w-full py-3.5 bg-[#2D312E] hover:bg-[#3A506B] text-[#F3EFE6] rounded-xl font-bold text-xs tracking-[0.15em] uppercase shadow-sm transition-all mt-4 cursor-pointer border border-[#2D312E]"
                >
                  {updating ? "Saving Changes..." : "Save Volume Entry"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}