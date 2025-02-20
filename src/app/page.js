"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GoogleIcon } from "./components/Icons";
// If using NextAuth, you can import signIn:
// import { signIn } from "next-auth/react";

export default function Home() {
 
  return (
    <main className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Navbar */}
     

      {/* Hero Section */}
      <section className="flex items-center justify-center flex-col text-center min-h-screen px-6">
        <h2 className="bg-clip-text text-transparent bg-gradient-to-b from-neutral-400 to-neutral-300 dark:from-neutral-500 dark:to-white text-3xl md:text-6xl font-bold tracking-tight">
          Real Estate Property Listings
        </h2>
        <p className="max-w-2xl text-lg md:text-xl text-neutral-200 mt-4">
          Discover available and sold properties directly on an interactive map
          powered by the Google Maps API.
        </p>

        {/* Explore Properties Button */}
        <Link
          href="/explore-properties"
          className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-semibold transition"
        >
          Explore Properties
        </Link>
      </section>

      {/* Footer */}
      <footer className="text-center py-3 mt-10">
        <p className="text-neutral-400">
          &copy; {new Date().getFullYear()} Real Estate Listings. All rights
          reserved.
        </p>
      </footer>

      {/* Modal Overlay */}
     
    </main>
  );
}
