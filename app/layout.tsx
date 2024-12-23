import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Configure the Inter font
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "700"], // Add font weights as needed
  display: "swap", // Ensures the font loads gracefully
});

export const metadata: Metadata = {
  title: "My Portfolio",
  description: "Showcasing my skills and projects",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
