"use client";

import React, { useState } from "react";
import Link from "next/link";
// If using NextAuth, you can import signIn:
// import { signIn } from "next-auth/react";

export default function Home() {
  // Modal visibility & mode ("login" or "register")
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("register");

  // Basic form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Open modal in a specific mode
  function openModal(mode) {
    setModalMode(mode);
    setShowModal(true);
  }

  // Close modal & reset form fields
  function closeModal() {
    setShowModal(false);
    setEmail("");
    setPassword("");
  }

  // Submit form (no real auth logic here)
  function handleSubmit(e) {
    e.preventDefault();
    if (modalMode === "login") {
      console.log("Logging in with:", { email, password });
    } else {
      console.log("Registering with:", { email, password });
    }
    closeModal();
  }

  // If using NextAuth for Google sign-in:
  // function handleGoogleSignIn() {
  //   signIn("google");
  // }

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
          {/* Only a Register button in the navbar */}
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

      {/* Modal Overlay */}
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

            {/* Title: "Register" or "Login" */}
            <h2 className="text-xl font-bold mb-4 text-center capitalize">
              {modalMode}
            </h2>

            {/* "Sign in with Google" Button */}
            <button
              type="button"
              // onClick={handleGoogleSignIn} // If using NextAuth
              onClick={() => alert("Google Sign In clicked! (Add NextAuth)")}
              className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-blue-700 px-4 py-2 rounded text-white font-semibold w-full mb-4"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 488 512"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M488 261.8c0-17.8-1.4-35.2-4-52H249v98h135.9c-5.9 32.6-23.8 60.1-50.6 78.4l82.1 63.6c47.8-44 75.6-108.9 75.6-187zM249 492c66.4 0 122-22 162.6-59.6l-82.1-63.6c-22 15-50.1 23.8-80.5 23.8-61.9 0-114.3-41.8-133-98.1H73.2v61.6C111.8 453.5 175.4 492 249 492zM116 256c0-10.4 1.6-20.4 4.4-30H73.2v61h47.2c-2.8-9.6-4.4-19.6-4.4-31zM249 130.8c33.6 0 63.8 11.6 87.7 34.3l65.8-64C370.7 67.6 315.4 44 249 44 175.4 44 111.8 82.5 73.2 142.5l47.2 36.5c18.6-56.3 71-98.2 132.6-98.2z" />
              </svg>
              Sign in with Google
            </button>

            {/* Divider */}
            <div className="flex items-center my-3">
              <hr className="flex-grow border-gray-600" />
              <span className="mx-2 text-gray-400">OR</span>
              <hr className="flex-grow border-gray-600" />
            </div>

            {/* Register/Login Form */}
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

            {/* Toggle Link: if in register mode, show "Already have an account?" */}
            {modalMode === "register" ? (
              <p className="text-center text-gray-300 mt-4">
                Already have an account?{" "}
                <button
                  onClick={() => setModalMode("login")}
                  className="text-blue-400 hover:underline"
                >
                  Login
                </button>
              </p>
            ) : (
              <p className="text-center text-gray-300 mt-4">
                Don&apos;t have an account?{" "}
                <button
                  onClick={() => setModalMode("register")}
                  className="text-blue-400 hover:underline"
                >
                  Register
                </button>
              </p>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
