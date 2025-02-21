"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { GoogleIcon } from "./Icons";

export default function AuthModal({ mode, onClose, setMode }) {
  // State for name when in register mode
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onSubmit(e) {
    e.preventDefault();

    if (mode === "register") {
      // Call your registration API route
      const res = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          password,
          provider: "credentials",
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        // Optionally auto-login after registration
        await signIn("credentials", {
          email,
          password,
          callbackUrl: "/",
        });
      } else {
        const errorData = await res.json();
        alert(errorData.error || errorData.message || "Registration failed");
      }
    } else {
      // For login, use NextAuth credentials
      await signIn("credentials", { email, password, callbackUrl: "/" });
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative bg-black/60 p-6 rounded-lg shadow-lg w-full max-w-md">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-300 hover:text-white"
          type="button"
        >
          &times;
        </button>

        {/* Modal Title */}
        <h2 className="text-xl font-bold mb-4 text-center capitalize text-white">
          {mode}
        </h2>

        {/* Sign in with Google */}
        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-blue-700 px-4 py-2 rounded text-white font-semibold w-full mb-4"
        >
          <GoogleIcon className="w-5" />
          Sign in with Google
        </button>

        <div className="flex items-center my-3">
          <hr className="flex-grow border-gray-600" />
          <span className="mx-2 text-gray-400">OR</span>
          <hr className="flex-grow border-gray-600" />
        </div>

        {/* Credentials Form */}
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          {mode === "register" && (
            <div>
              <label htmlFor="name" className="block mb-1 text-gray-300">
                Name
              </label>
              <input
                id="name"
                type="text"
                className="w-full px-3 py-2 bg-gray-800 text-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block mb-1 text-gray-300">
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
            <label htmlFor="password" className="block mb-1 text-gray-300">
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
            {mode === "login" ? "Login" : "Register"}
          </button>
        </form>

        {/* Toggle Register/Login */}
        {mode === "register" ? (
          <p className="text-center text-gray-300 mt-4">
            Already have an account?{" "}
            <button
              onClick={() => setMode("login")}
              className="text-blue-400 hover:underline"
              type="button"
            >
              Login
            </button>
          </p>
        ) : (
          <p className="text-center text-gray-300 mt-4">
            Don&apos;t have an account?{" "}
            <button
              onClick={() => setMode("register")}
              className="text-blue-400 hover:underline"
              type="button"
            >
              Register
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
