"use client";

import Link from 'next/link'
import React, { useState } from 'react'
import { GoogleIcon } from './Icons';
import { useRouter } from 'next/navigation';

const Navbar = () => {
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState("register");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function openModal(mode) {
        setModalMode(mode);
        setShowModal(true);
    }

    function closeModal() {
        setShowModal(false);
        setEmail("");
        setPassword("");
    }

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

    const router = useRouter()

    return (
        <>
            <nav className="fixed top-0 left-0 w-full backdrop-blur-sm shadow-lg px-6 py-4 flex items-center z-50">
                <h1 onClick={() => {
                    router.push('/')
                }} className="text-3xl font-semibold text-white hover:text-blue-400 cursor-pointer">
                    Real Estate
                </h1>
                <ul className="flex gap-6 text-lg absolute right-6 text-white">
                    <li>
                        <Link href="/" className="hover:text-blue-400 transition">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link href="/about-us" className="hover:text-blue-400 transition">
                            About Us
                        </Link>
                    </li>
                    <li>
                        <Link href="/contact-us" className="hover:text-blue-400 transition">
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
            {showModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="relative bg-black/60 p-6 rounded-lg shadow-lg w-full max-w-md">
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-gray-300 hover:text-white"
                        >
                            &times;
                        </button>

                        <h2 className="text-xl font-bold mb-4 text-center capitalize text-white">
                            {modalMode}
                        </h2>

                        <button
                            type="button"
                            onClick={() => alert("Google Sign In clicked! (Add NextAuth)")}
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

                        {modalMode === "register" ? (
                            <p className="text-center text-gray-300 mt-4">
                                Already have an account?{" "}
                                <button
                                    onClick={() => setModalMode("login")}
                                    className="text-blue-400 hover:underline "
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
        </>
    )
}

export default Navbar