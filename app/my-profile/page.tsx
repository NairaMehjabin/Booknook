"use client";

import { useState, useEffect, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut, authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  LogOut,
  Sparkles,
  User,
  Mail,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  Edit3,
  ImageIcon,
  Save,
  X,
  ArrowLeft
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { y: 15, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending, refetch } = useSession();
  const user = session?.user;

  // Synchronous layout effect updates the title BEFORE DOM paint occurs
  useIsomorphicLayoutEffect(() => {
    document.title = "BookNook | Reader Profile";
  }, []);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    image: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!isPending && !user) {
      router.push("/login");
    } else if (user) {
      setFormData({
        name: user.name || "",
        image: user.image || "",
      });
    }
  }, [user, isPending, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    const toastId = toast.loading("Updating profile details...", {
      style: { background: "#2D312E", color: "#F3EFE6", borderRadius: "1rem" },
    });

    try {
      const { error } = await authClient.updateUser({
        name: formData.name,
        image: formData.image,
      });

      if (error) {
        throw new Error(error.message || "Failed to update profile.");
      }

      toast.success("Profile updated successfully! ✨", { id: toastId });
      setIsEditing(false);
      refetch();
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.", { id: toastId });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    const toastId = toast.loading("Signing out from archive...", {
      style: { background: "#2D312E", color: "#F3EFE6", borderRadius: "1rem" },
    });

    await signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Signed out successfully. Safe travels!", { id: toastId });
          router.push("/login");
          router.refresh();
        },
        onError: () => {
          toast.error("Failed to sign out.", { id: toastId });
        }
      },
    });
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-[#FBF9F4] flex flex-col items-center justify-center font-serif text-[#1C242B]">
        <motion.div
          animate={{ scale: [1, 1.08, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-3xl mb-3"
        >
          📖
        </motion.div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#6B7280]">
          Opening reader profile...
        </p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#FBF9F4] text-[#1C242B] py-24 px-6 md:px-12 relative overflow-hidden font-serif">
      
      {/* Background Vintage Texture Matching the Rest of the App */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-30 z-0 bg-repeat"
        style={{ backgroundImage: "url('/assets/details-bg.png')", backgroundSize: '500px auto' }}
      />

      <div className="max-w-4xl mx-auto relative z-10 space-y-8 pt-12 sm:pt-16">
        
        {/* BACK TO LIBRARY BUTTON */}
        <div>
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

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* LEFT CONTAINER (User Identity Card) */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="md:col-span-5 space-y-6"
          >
            <motion.div 
              variants={itemVariants} 
              className="bg-[#FBF9F4] border-[3px] border-[#2D312E] rounded-[35px] p-8 shadow-[8px_8px_0px_0px_#2D312E] relative overflow-hidden"
            >
              {/* Category / Role Badge */}
              <div className="absolute top-4 right-4 bg-[#3A506B] text-white text-[9px] tracking-widest font-black px-3 py-1 rounded-full uppercase border border-[#2D312E] shadow-sm">
                Reader Member
              </div>

              <div className="flex flex-col items-center text-center space-y-4 pt-2">
                <div className="relative">
                  <div className="w-28 h-28 rounded-[25px] overflow-hidden bg-[#EFECE6] border-2 border-[#2D312E] p-1 shadow-inner flex items-center justify-center relative">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name || "Reader"}
                        fill
                        className="object-cover rounded-[20px]"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#3A506B] text-white flex items-center justify-center text-3xl font-bold font-sans">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1 w-full">
                  <h1 className="text-2xl font-bold tracking-tight text-[#1C242B] font-serif">
                    {user.name}
                  </h1>
                  <p className="font-sans text-xs text-[#6B7280] font-semibold tracking-wider break-all">
                    {user.email}
                  </p>
                </div>

                <div className="pt-4 w-full flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(!isEditing)}
                    className="w-full text-center px-6 py-3.5 rounded-2xl bg-[#EFECE6] hover:bg-[#EAE5D9] text-[#1C242B] border-2 border-[#2D312E] text-xs font-sans font-bold uppercase tracking-widest transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isEditing ? <X size={15} /> : <Edit3 size={15} />}
                    {isEditing ? "Cancel Editing" : "Edit Profile"}
                  </button>

                  <Link
                    href="/my-borrows"
                    className="w-full text-center px-6 py-3.5 rounded-2xl bg-[#2D312E] hover:bg-[#3A506B] text-[#F3EFE6] text-xs font-sans font-bold uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <BookOpen size={15} /> My Borrows Archive <ArrowRight size={14} />
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-center px-6 py-3.5 rounded-2xl bg-[#FBF9F4] text-red-600 border-2 border-red-600/30 hover:bg-red-50 text-xs font-sans font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT CONTAINER (Profile Details or Edit Form) */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="md:col-span-7 space-y-6"
          >
            <motion.div 
              variants={itemVariants}
              className="bg-[#FBF9F4] border-[3px] border-[#2D312E] rounded-[35px] p-8 shadow-[8px_8px_0px_0px_#2D312E] space-y-6"
            >
              <div>
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#3A506B] text-white text-[9px] uppercase tracking-widest font-black mb-3 border border-[#2D312E]">
                  <Sparkles size={10} /> {isEditing ? "Edit Mode" : "Account Registry"}
                </div>
                <h3 className="text-2xl font-bold font-serif text-[#1C242B]">
                  {isEditing ? "Update Profile Information" : "Profile Details"}
                </h3>
              </div>

              {isEditing ? (
                <form onSubmit={handleUpdateProfile} className="space-y-4 font-sans">
                  <div>
                    <label className="block text-[10px] font-black text-[#2D312E] uppercase tracking-widest mb-1.5 ml-1">
                      Full Name
                    </label>
                    <div className="relative rounded-2xl bg-[#EFECE6]/50 border-2 border-[#2D312E]/20 focus-within:border-[#2D312E] transition-all overflow-hidden">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#6B7280]">
                        <User size={16} />
                      </div>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-11 pr-5 py-3 text-xs font-semibold text-[#1C242B] bg-transparent focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-[#2D312E] uppercase tracking-widest mb-1.5 ml-1">
                      Photo-URL (Avatar)
                    </label>
                    <div className="relative rounded-2xl bg-[#EFECE6]/50 border-2 border-[#2D312E]/20 focus-within:border-[#2D312E] transition-all overflow-hidden">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#6B7280]">
                        <ImageIcon size={16} />
                      </div>
                      <input
                        type="url"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        placeholder="https://example.com/photo.jpg"
                        className="w-full pl-11 pr-5 py-3 text-xs font-semibold text-[#1C242B] bg-transparent focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="w-full py-3.5 bg-[#2D312E] hover:bg-[#3A506B] text-[#F3EFE6] rounded-2xl font-bold text-xs tracking-widest uppercase shadow-md transition-all mt-4 flex items-center justify-center gap-2 cursor-pointer border-2 border-[#2D312E]"
                  >
                    <Save size={15} />
                    {isUpdating ? "Saving Changes..." : "Save Profile Updates"}
                  </button>
                </form>
              ) : (
                <>
                  <div className="bg-[#EFECE6]/60 rounded-2xl border-2 border-[#2D312E]/15 p-6 space-y-4 font-sans">
                    <div className="flex items-center justify-between border-b border-[#2D312E]/10 pb-3">
                      <div className="flex items-center gap-2.5 text-xs text-[#6B7280] uppercase tracking-wider font-bold">
                        <User size={15} className="text-[#3A506B]" /> Full Name
                      </div>
                      <span className="text-xs font-bold text-[#1C242B]">{user.name}</span>
                    </div>

                    <div className="flex items-center justify-between border-b border-[#2D312E]/10 pb-3">
                      <div className="flex items-center gap-2.5 text-xs text-[#6B7280] uppercase tracking-wider font-bold">
                        <Mail size={15} className="text-[#3A506B]" /> Email Address
                      </div>
                      <span className="text-xs font-semibold text-[#1C242B]">{user.email}</span>
                    </div>

                    <div className="flex items-center justify-between pb-1">
                      <div className="flex items-center gap-2.5 text-xs text-[#6B7280] uppercase tracking-wider font-bold">
                        <ShieldCheck size={15} className="text-green-600" /> Account Status
                      </div>
                      <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border border-green-300">
                        Active & Verified
                      </span>
                    </div>
                  </div>

                  <div className="bg-[#3A506B]/10 border-2 border-dashed border-[#3A506B]/30 p-5 rounded-2xl">
                    <h4 className="font-serif font-bold text-sm text-[#1C242B] mb-1">Quick Navigation</h4>
                    <p className="font-sans text-xs text-[#6B7280] leading-relaxed">
                      You can explore all available volumes in the <Link href="/all-books" className="text-[#3A506B] font-bold underline">All Books Archive</Link> or add your own contributions via <Link href="/add-book" className="text-[#3A506B] font-bold underline">Add Book</Link>.
                    </p>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>

        </div>

      </div>
    </main>
  );
}