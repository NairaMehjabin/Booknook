import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans, Pacifico } from "next/font/google";
import Navbar from "./components/Navbar";
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
  title: "BookNook | A Small Online Library",
  description: "Add a book, borrow a book, return a book.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable} ${pacifico.variable}`}>
      <body className="bg-[#FBF9F4] text-[#2D312E] font-sans antialiased min-h-screen selection:bg-[#C86228] selection:text-white">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}