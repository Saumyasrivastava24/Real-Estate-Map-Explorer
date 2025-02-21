"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Page() {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch houses from your API
  useEffect(() => {
    async function fetchHouses() {
      try {
        const res = await fetch("/api/houses");
        const data = await res.json();
        if (data.success) {
          setHouses(data.data);
        }
      } catch (error) {
        console.error("Error fetching houses:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchHouses();
  }, []);

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Navbar */}
      <nav className="p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Real Estate Listings</h1>
        <Link
          href="/new-property"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition"
        >
          Add New Property
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center min-h-screen px-6">
        <motion.h2
          className="bg-clip-text text-transparent bg-gradient-to-b from-neutral-400 to-neutral-300 dark:from-neutral-500 dark:to-white text-3xl md:text-6xl font-bold tracking-tight"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Real Estate Property Listings
        </motion.h2>
        <motion.p
          className="max-w-2xl text-lg md:text-xl text-neutral-200 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          Discover available and sold properties directly on an interactive map powered by the Google Maps API.
        </motion.p>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-6"
        >
          <Link
            href="/explore-properties"
            className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-semibold transition"
          >
            Explore Properties
          </Link>
        </motion.div>
      </section>

      {/* Houses Listing Section */}
      <section className="px-6 py-10">
        <h3 className="text-2xl font-bold mb-6">Available Houses</h3>
        {loading ? (
          <p>Loading...</p>
        ) : houses.length === 0 ? (
          <p>No houses available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {houses.map((house, index) => (
              <motion.div
                key={house._id}
                className="bg-gray-800 p-6 rounded-lg shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h4 className="text-xl font-bold mb-2">
                  {house.title || "House Title"}
                </h4>
                <p className="text-neutral-300">
                  {house.description || "House description"}
                </p>
                <Link
                  href={`/property/${house._id}`}
                  className="mt-4 inline-block text-blue-400 hover:underline"
                >
                  View Details
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="text-center py-3 mt-10">
        <p className="text-neutral-400">
          &copy; {new Date().getFullYear()} Real Estate Listings. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
