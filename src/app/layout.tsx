import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sora Living | Curated Nord-Japandi Furniture & Objects",
  description: "Architectural furniture handcrafted with Japanese wabi-sabi principles and Scandinavian clarity.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${jakarta.variable} h-full antialiased selection:bg-[#1C1917] selection:text-[#FAF7F2]`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#FAF7F2] text-[#1C1917] text-rendering-optimizeLegibility">
        {children}
      </body>
    </html>
  );
}
