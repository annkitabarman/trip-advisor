"use client";

import { useState } from "react";
import Link from "next/link";

const currencies = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "INR", symbol: "₹" },
  { code: "JPY", symbol: "¥" },
];

export default function Navbar() {
  const [currency, setCurrency] = useState("USD");
  const [showCurrencies, setShowCurrencies] = useState(false);

  return (
    <header className="absolute left-0 top-0 z-50 w-full bg-black/25 backdrop-blur-sm">
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/40 to-transparent" />
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 font-[family-name:var(--font-montserrat)] lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-extrabold tracking-tight text-white"
        >
          Trip<span className="text-pink-400">Advisor</span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <form
            action="/search"
            method="GET"
            className="hidden items-center rounded-full border border-white/30 bg-white/10 px-4 py-2 backdrop-blur-md transition focus-within:bg-white/20 md:flex"
          >
            {/* Search icon */}
            <svg
              className="mr-2 h-5 w-5 text-white/80"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>

            <input
              name="q"
              type="search"
              placeholder="Search"
              autoComplete="off"
              className="w-32 bg-transparent text-sm font-semibold text-white outline-none placeholder:text-white/70"
            />
          </form>

          {/* Currency */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowCurrencies(!showCurrencies)}
              className="flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
            >
              <span>{currency}</span>

              <svg
                className={`h-4 w-4 transition-transform ${
                  showCurrencies ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {showCurrencies && (
              <div className="absolute right-0 mt-2 w-32 overflow-hidden rounded-xl border border-white/20 bg-black/80 p-1 shadow-xl backdrop-blur-xl">
                {currencies.map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => {
                      setCurrency(item.code);
                      setShowCurrencies(false);
                    }}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-white transition hover:bg-white/10"
                  >
                    <span>{item.code}</span>
                    <span className="text-white/60">{item.symbol}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Favorites */}
          <Link
            href="/favorites"
            aria-label="Favorites"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path d="M20.8 8.8c0 5.5-8.8 10.2-8.8 10.2S3.2 14.3 3.2 8.8C3.2 5.7 5.3 4 7.8 4c1.5 0 2.9.8 4.2 2.1C13.3 4.8 14.7 4 16.2 4c2.5 0 4.6 1.7 4.6 4.8Z" />
            </svg>
          </Link>

          {/* Sign in */}
          <Link
            href="/sign-in"
            className="rounded-full border border-white/40 bg-white/10 px-5 py-2.5 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white hover:text-gray-900"
          >
            Sign in
          </Link>
        </div>
      </nav>
    </header>
  );
}
