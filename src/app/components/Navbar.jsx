"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import AuthModal from "./AuthModal";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

const Navbar = () => {
    const { data: session } = useSession();
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState("register");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const router = useRouter();
    const dropdownRef = useRef(null);

    const openModal = (mode) => {
        setModalMode(mode);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEmail("");
        setPassword("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (modalMode === "login") {
            console.log("Logging in with:", { email, password });
            // Call signIn for credentials
            // signIn('credentials', { email, password, callbackUrl: '/' });
        } else {
            console.log("Registering with:", { email, password });
            // Call your registration API and then signIn if needed
        }
        closeModal();
    };

    const handleLogout = async () => {
        await signOut({ callbackUrl: "/" });
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <>
            <nav className="fixed top-0 left-0 w-full backdrop-blur-sm shadow-lg px-6 py-4 flex items-center z-50">
                <h1
                    onClick={() => router.push("/")}
                    className="text-3xl font-semibold text-white hover:text-blue-400 cursor-pointer"
                >
                    Real Estate
                </h1>
                <ul className="flex gap-6 text-lg absolute right-6 text-white items-center">
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
                    <li className="relative" ref={dropdownRef}>
                        {session ? (
                            <button
                                onClick={() => setDropdownOpen((prev) => !prev)}
                                className="hover:text-blue-400 transition focus:outline-none"
                            >
                                {session.user.image ? (
                                    <Image
                                        src={session.user.image}
                                        alt="Profile"
                                        width={32}
                                        height={32}
                                        className="rounded-full"
                                    />
                                ) : (
                                    <span className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                                        <span className="text-sm text-white">P</span>
                                    </span>
                                )}
                            </button>
                        ) : (
                            <button
                                onClick={() => openModal("register")}
                                className="hover:text-blue-400 transition"
                            >
                                Register
                            </button>
                        )}
                        {/* Dropdown */}
                        {dropdownOpen && (
                            <div
                                className="absolute right-0 mt-2 w-40 bg-gray-800 rounded-md shadow-lg overflow-hidden transition transform origin-top-right animate-fade-in"
                            >
                                <Link
                                    href="/profile"
                                    onClick={() => setDropdownOpen(false)}
                                    className="block px-4 py-2 text-sm text-white hover:bg-gray-700 transition"
                                >
                                    Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left block px-4 py-2 text-sm text-white hover:bg-gray-700 transition"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </li>
                </ul>
            </nav>

            {showModal && (
                <AuthModal
                    mode={modalMode}
                    onClose={closeModal}
                    onSubmit={handleSubmit}
                    email={email}
                    setEmail={setEmail}
                    password={password}
                    setPassword={setPassword}
                    setMode={setModalMode}
                />
            )}
        </>
    );
};

export default Navbar;
