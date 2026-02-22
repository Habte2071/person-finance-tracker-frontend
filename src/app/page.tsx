import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Animated background blobs - responsive sizing */}
      <div className="absolute top-0 -left-4 w-48 h-48 sm:w-72 sm:h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-[blob_7s_infinite]"></div>
      <div className="absolute top-0 -right-4 w-48 h-48 sm:w-72 sm:h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-[blob_7s_infinite_2s]"></div>
      <div className="absolute -bottom-8 left-20 w-48 h-48 sm:w-72 sm:h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-[blob_7s_infinite_4s]"></div>
      
      {/* Main content card - responsive padding */}
      <main className="relative w-full max-w-4xl mx-4 backdrop-blur-xl bg-white/70 dark:bg-black/50 rounded-3xl shadow-2xl border border-white/20 dark:border-white/10 p-6 xs:p-8 sm:p-10 md:p-12 lg:p-16">
        <div className="flex flex-col items-center text-center sm:items-start sm:text-left gap-6 sm:gap-8">
          {/* Logo with hover effect - responsive width */}
          <div className="transform transition-transform duration-300 hover:scale-105">
            <Image 
              className="dark:invert w-auto h-auto" 
              src="/next.svg" 
              alt="Next.js logo" 
              width={120} 
              height={24} 
              priority 
            />
          </div>

          {/* Text content - responsive spacing */}
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-3xl xs:text-4xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent leading-tight">
              Personal Finance Manager
            </h1>
            <p className="text-base xs:text-lg sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
              Take control of your finances with our easy-to-use tools. Track spending, set budgets, and achieve your financial goals.
            </p>
          </div>

          {/* CTA Buttons - responsive layout */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
            <Link href="/login" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 px-6 py-3 text-base sm:px-8 sm:py-4 sm:text-lg">
                Get Started
              </Button>
            </Link>
            <Link href="/register" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto border-2 hover:bg-gray-100 dark:hover:bg-gray-800 dark:border-gray-600 dark:text-gray-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 px-6 py-3 text-base sm:px-8 sm:py-4 sm:text-lg">
                Create Account
              </Button>
            </Link>
          </div>

          {/* Trust indicator - responsive text size */}
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-4">
            🔒 Secure • Free • No credit card required
          </p>
        </div>
      </main>
    </div>
  );
}