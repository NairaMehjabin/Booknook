"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, Sparkles, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { signIn } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const toastId = toast.loading("Authenticating with archive...", {
      style: { background: "#2D312E", color: "#F3EFE6", borderRadius: "1rem", border: "1px solid #3A506B" },
    });

    try {
      await signIn.email(
        {
          email: formData.email,
          password: formData.password,
        },
        {
          onSuccess: () => {
            toast.success("Welcome back to BookNook! 📚", {
              id: toastId,
              duration: 2500,
              style: { background: "#FBF9F4", color: "#1C242B", borderRadius: "1rem", border: "2px solid #3A506B" },
            });
            router.push("/");
            router.refresh();
          },
          onError: (ctx) => {
            setLoading(false);
            toast.error(ctx.error.message || "Invalid email or password.", {
              id: toastId,
              duration: 4000,
              style: { background: '#FBF9F4', color: '#1C242B', borderRadius: '1rem', border: '2px solid #2D312E' }
            });
          },
        }
      );
    } catch (err: any) {
      setLoading(false);
      toast.error(err.message || "Login failed. Try again.", {
        id: toastId,
        style: { background: '#FBF9F4', color: '#1C242B', borderRadius: '1rem', border: '2px solid #2D312E' }
      });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (err: any) {
      toast.error("Google authentication failed.");
    }
  };

  return (
    <main className="min-h-screen bg-[#FBF9F4] text-[#1C242B] flex items-center justify-center pt-32 pb-24 px-6 relative overflow-hidden">
      
      {/* Background Vintage Texture */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-30 z-0 bg-repeat"
        style={{ backgroundImage: "url('/assets/details-bg.png')", backgroundSize: '500px auto' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-[#FBF9F4] w-full max-w-lg shadow-[10px_10px_0px_0px_#2D312E] border-[3px] border-[#2D312E] relative z-10 px-8 py-10 sm:px-12 rounded-[35px]"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#3A506B] text-white text-[9px] uppercase tracking-widest font-black mb-3 border border-[#2D312E]">
            <Sparkles size={10} /> Member Portal
          </div>
          <h1 className="text-4xl font-['var(--font-handwritten)'] font-bold text-[#1C242B]">Reader Login</h1>
          <p className="font-serif italic text-xs sm:text-sm text-[#6B7280] mt-1">
            Enter the archive to continue borrowing and sharing stories.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-black text-[#2D312E] uppercase tracking-widest mb-1.5 ml-1">
              Email Address
            </label>
            <div className="relative rounded-2xl bg-[#EFECE6]/50 border-2 border-[#2D312E]/20 focus-within:border-[#2D312E] transition-all overflow-hidden">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#6B7280]">
                <Mail size={16} />
              </div>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="reader@booknook.com"
                className="w-full pl-11 pr-5 py-3 text-xs font-semibold text-[#1C242B] placeholder-[#6B7280]/50 bg-transparent focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5 ml-1">
              <label className="text-[10px] font-black text-[#2D312E] uppercase tracking-widest">
                Password
              </label>
              <Link href="#" className="text-[10px] font-bold text-[#3A506B] hover:underline">
                Forgot Password?
              </Link>
            </div>
            <div className="relative rounded-2xl bg-[#EFECE6]/50 border-2 border-[#2D312E]/20 focus-within:border-[#2D312E] transition-all overflow-hidden">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#6B7280]">
                <Lock size={16} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-11 pr-12 py-3 text-xs font-semibold text-[#1C242B] bg-transparent focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#6B7280] hover:text-[#1C242B]"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#2D312E] hover:bg-[#3A506B] text-[#F3EFE6] rounded-2xl font-bold text-xs tracking-widest uppercase shadow-[4px_4px_0px_0px_#3A506B] transition-all mt-2 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 border-2 border-[#2D312E]"
          >
            {loading ? "Verifying..." : (
              <>
                Login to Archive <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>

        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#2D312E]/15"></div></div>
          <span className="relative bg-[#FBF9F4] px-4 text-[9px] font-mono uppercase tracking-widest text-[#6B7280] font-black">
            Or Connect With
          </span>
        </div>

        <button
          onClick={handleGoogleLogin}
          type="button"
          className="w-full py-3.5 bg-white hover:bg-gray-50 text-[#1C242B] border-2 border-[#2D312E] rounded-2xl font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-3 cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          Continue with Google
        </button>

        <p className="text-center text-xs text-[#6B7280] font-medium mt-8">
          New to BookNook?{' '}
          <Link href="/register" className="text-[#1C242B] font-black hover:text-[#3A506B] underline underline-offset-4">
            Register an account
          </Link>
        </p>
      </motion.div>
    </main>
  );
}