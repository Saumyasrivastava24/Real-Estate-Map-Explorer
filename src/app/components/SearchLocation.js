"use client";

export default function SearchLocation({ searchQuery, setSearchQuery }) {
  return (
    <input
      type="text"
      placeholder="Search locations..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="border rounded px-3 py-2 w-full md:w-64"
    />
  );
}
