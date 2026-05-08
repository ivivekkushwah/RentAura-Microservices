import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import { Navbar } from "@/components/Navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
});

export const metadata: Metadata = {
  title: "RentAura | Find Rooms, Hostels & Rentals Easily",
  description:
    "RentAura is your trusted platform to find verified rental rooms, hostels, and PGs with ease. Search by city, filter by budget, explore owner rules, and book securely — all in one place.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    
      <div className={`${inter.variable} ${robotoMono.variable} antialiased`}>
        <Navbar />
        <main className="  ">{children}</main>
      </div>
    
  );
}
