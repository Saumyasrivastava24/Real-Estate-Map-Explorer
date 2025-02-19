"use client";

import { useState } from "react";
import PropertyCard from "./components/PropertyCard";
import SearchLocation from "./components/SearchLocation";

export default function Home() {
  const [properties, setProperties] = useState([
    {
      id: 1,
      name: "Modern Apartment",
      address: "123 Main St, San Francisco, CA",
      price: 5000000,
      available: true,
      image: "https://source.unsplash.com/400x300/?house,modern",
      liked: false,
    },
    {
      id: 2,
      name: "Luxury Villa",
      address: "456 Beach Rd, Miami, FL",
      price: 12000000,
      available: false,
      image: "https://source.unsplash.com/400x300/?villa,luxury",
      liked: false,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState(10000000);
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredProperties = properties.filter(
    (property) =>
      property.address.toLowerCase().includes(searchQuery.toLowerCase()) && // Filter by address
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
    <main className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Explore Properties
      </h1>
      <div className="flex flex-col md:flex-row md:justify-between mb-4 gap-4">
        <SearchLocation
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>

     
        {/* Left: Map Section */}
        <div className="relative w-full h-[500px] bg-gray-200 flex  items-center justify-center rounded-lg shadow-lg">
          <p className="text-gray-600">Google Map will be displayed here</p>
        </div>
        <div>
          <label className="mr-2">Status:</label>
          <select
            className="border rounded px-2 py-1"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="available">Available</option>
            <option value="sold">Sold</option>
          </select>
        </div>
        <div>
          <label className="mr-2">
            Max Price: ₹{priceRange.toLocaleString()}
          </label>
          <input
            type="range"
            min="100000"
            max="50000000"
            value={priceRange}
            onChange={(e) => setPriceRange(Number(e.target.value))}
            className="w-40"
          />
        </div>
        {/* Right: Property Listings */}
        <div className="grid gap-4 w-full">
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onToggleLike={() => toggleLike(property.id)}
              />
            ))
          ) : (
            <p className="text-gray-500">No properties found.</p>
          )}
        </div>
      
    </main>
  );
}
