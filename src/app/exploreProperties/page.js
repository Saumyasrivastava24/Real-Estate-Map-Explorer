"use client";

import { useState } from "react";
import PropertyCard from "../components/PropertyCard";
import SearchLocation from "../components/SearchLocation";

export default function ExploreProperties() {
  const [properties, setProperties] = useState([
    {
      id: 1,
      name: "Modern Apartment",
      address: "123 Main St, San Francisco, CA",
      price: 5000000,
      available: true,
      image: "https://source.unsplash.com/featured/?modern,apartment",
      liked: false,
    },
    {
      id: 2,
      name: "Luxury Villa",
      address: "456 Beach Rd, Miami, FL",
      price: 12000000,
      available: false,
      image: "https://source.unsplash.com/featured/?luxury,villa",
      liked: false,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState(10000000);
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredProperties = properties.filter(
    (property) =>
      property.address.toLowerCase().includes(searchQuery.toLowerCase()) &&
      property.price <= priceRange &&
      (statusFilter === "all" ||
        (statusFilter === "available" && property.available) ||
        (statusFilter === "sold" && !property.available))
  );

  const toggleLike = (id) => {
    setProperties((prevProperties) =>
      prevProperties.map((property) =>
        property.id === id ? { ...property, liked: !property.liked } : property
      )
    );
  };

  return (
    <main className="p-6 max-w-full mx-auto bg-gradient-to-br from-gray-900 via-gray-800 to-black min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-100">
        Explore Properties
      </h1>
      <div className="flex justify-center mb-4">
        <SearchLocation
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>

      <div className="relative w-full h-[500px] bg-gray-700 flex items-center justify-center rounded-lg shadow-lg mb-6">
        <p className="text-gray-300">Google Map will be displayed here</p>
      </div>

      <div className="flex flex-wrap gap-6 mb-6 justify-center">
        <div className="flex items-center gap-2">
          <label className="text-gray-300">Status:</label>
          <select
            className="border border-gray-600 rounded px-3 py-2 bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="available">Available</option>
            <option value="sold">Sold</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-gray-300">
            Max Price: ₹{priceRange.toLocaleString()}
          </label>
          <input
            type="range"
            min="100000"
            max="50000000"
            value={priceRange}
            onChange={(e) => setPriceRange(Number(e.target.value))}
            className="w-40 accent-blue-500"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.length > 0 ? (
          filteredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onToggleLike={() => toggleLike(property.id)}
            />
          ))
        ) : (
          <p className="text-gray-300 col-span-full text-center">
            No properties found.
          </p>
        )}
      </div>
    </main>
  );
}
