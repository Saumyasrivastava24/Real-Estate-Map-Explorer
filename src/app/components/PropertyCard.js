"use client";

import React from "react";
import Link from "next/link";

export default function PropertyCard({ property, onToggleLike }) {
  const fallbackImage = "/not-found.png";

  const imageUrl =
    property.images.length > 0 && property.images[0].startsWith("http")
      ? property.images[0]
      : fallbackImage;

  return (
    <Link href={`/property/${property._id}`}>
      <div className="relative bg-gray-700 shadow-lg rounded-lg overflow-hidden cursor-pointer">
        <img
          src={imageUrl}
          alt={property.name}
          className="w-full h-40 object-cover"
          onError={(e) => (e.target.src = fallbackImage)}
        />
        <div className="p-4">
          <h2 className="font-bold text-xl text-gray-100">{property.name}</h2>
          <p className="text-gray-400">{property.address}</p>
          <p className="text-lg font-semibold text-gray-200">
            ₹{property.price?.toLocaleString() ?? "N/A"}
          </p>
        </div>

        {/* Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent navigation when clicking like button
            onToggleLike();
          }}
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${property.liked ? "text-red-500" : "text-gray-500"
            }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill={property.liked ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            className="w-6 h-6"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5c0-3.08 2.5-5.5 5.5-5.5 1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3c3 0 5.5 2.42 5.5 5.5 0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>
      </div>
    </Link>
  );
}
