import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Disclaimer from "@/components/Disclaimer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Crosley Referral Law Group | Personal Injury Case Referrals",
  description: "Licensed attorney-owned referral engine connecting personal injury cases to qualified legal partners in Texas. Ethical, compliant, data-driven case referrals.",
  keywords: "personal injury, legal referral, Texas attorney, case referral, PI law",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-extrabold text-primary-700 leading-tight">
                  Crosley Referral Law Group
                </h1>
                <p className="text-sm text-gray-600">Licensed Attorney Referral Services</p>
              </div>
              <nav>
                <a
                  href="/intake"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                >
                  Submit Your Case
                </a>
              </nav>
            </div>
          </div>
        </header>
        
        <main className="min-h-screen">
          {children}
        </main>

        <footer className="bg-gray-50 border-t border-gray-200 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Disclaimer />
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>&copy; {new Date().getFullYear()} Crosley Referral Law Group, PLLC. All rights reserved.</p>
              <p className="mt-2">Texas Licensed Attorney Referral Service</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

