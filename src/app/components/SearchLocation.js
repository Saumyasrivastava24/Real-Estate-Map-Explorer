"use client";

import React from "react";

export default function SearchLocation({ searchQuery, setSearchQuery }) {
  return (
    <input
      type="text"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="border border-gray-600 rounded px-3 py-2 bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full max-w-xl"
      placeholder="Search location..."
    />
  );
}
