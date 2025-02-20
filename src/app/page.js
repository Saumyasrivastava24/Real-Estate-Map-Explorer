"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function Home() {
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("login"); // or "register"

  // Form fields (you can add more if needed)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Open modal with the desired mode
  function openModal(mode) {
    setModalMode(mode);
    setShowModal(true);
  }

  // Close modal
  function closeModal() {
    setShowModal(false);
    setEmail("");
    setPassword("");
  }

  // Handle form submit (no real auth logic yet)
  function handleSubmit(e) {
    e.preventDefault();
    if (modalMode === "login") {
      console.log("Logging in with:", { email, password });
    } else {
      console.log("Registering with:", { email, password });
    }
    // Close modal or handle further logic
    closeModal();
  }

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full backdrop-blur-sm shadow-lg px-6 py-4 flex justify-center items-center z-50">
        <h1 className="text-4xl font-bold text-white hover:text-blue-400">
          Real Estate
        </h1>
        <ul className="flex gap-6 text-lg absolute right-6">
          <li>
            <Link href="/" className="hover:text-blue-400 transition">
              Home
            </Link>
          </li>
          <li>
            <Link href="/aboutUs" className="hover:text-blue-400 transition">
              About Us
            </Link>
          </li>
          <li>
            <Link href="/contactUs" className="hover:text-blue-400 transition">
              Contact Us
            </Link>
          </li>
          {/* Instead of separate pages, open modal */}
          <li>
            <button
              onClick={() => openModal("login")}
              className="hover:text-blue-400 transition"
            >
              Login
            </button>
          </li>
          <li>
            <button
              onClick={() => openModal("register")}
              className="hover:text-blue-400 transition"
            >
              Register
            </button>
          </li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section className="flex items-center justify-center flex-col text-center min-h-screen px-6">
        <h2 className="bg-clip-text text-transparent bg-gradient-to-b from-neutral-900 to-neutral-300 dark:from-neutral-500 dark:to-white text-3xl md:text-6xl font-bold tracking-tight">
          Real Estate Property Listings
        </h2>
        <p className="max-w-2xl text-lg md:text-xl text-neutral-200 mt-4">
          Discover available and sold properties directly on an interactive map
          powered by the Google Maps API.
        </p>

        {/* Explore Properties Button */}
        <Link
          href="/exploreProperties"
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

      {/* Modal Overlay (Login/Register) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="relative bg-black/60 p-6 rounded-lg shadow-lg w-full max-w-md">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-300 hover:text-white"
            >
              &times;
            </button>

            {/* Title */}
            <h2 className="text-xl font-bold mb-4 text-center">
              {modalMode === "login" ? "Login" : "Register"}
            </h2>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block mb-1 text-gray-300" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full px-3 py-2 bg-gray-800 text-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block mb-1 text-gray-300" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className="w-full px-3 py-2 bg-gray-800 text-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white font-semibold w-full mt-2"
              >
                {modalMode === "login" ? "Login" : "Register"}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
