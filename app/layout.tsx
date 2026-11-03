import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans, Pacifico } from "next/font/google";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-handwritten",
});

export const metadata: Metadata = {
  description: "Add a book, borrow a book, return a book.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable} ${pacifico.variable}`}>
      <body className="bg-[#FBF9F4] text-[#2D312E] font-sans antialiased min-h-screen flex flex-col justify-between selection:bg-[#C86228] selection:text-white">
        {/* Persistent Toaster across all route navigations */}
        <Toaster 
          position="top-center" 
          reverseOrder={false} 
          toastOptions={{
            style: {
              background: "#2D312E",
              color: "#F3EFE6",
              borderRadius: "1rem",
              fontFamily: "var(--font-sans)",
              fontSize: "12px",
            }
          }}
        />
        <div className="flex-grow">
          <Navbar />
          <main>{children}</main>
        </div>
        <Footer />
      </body>
    </html>
  );
}