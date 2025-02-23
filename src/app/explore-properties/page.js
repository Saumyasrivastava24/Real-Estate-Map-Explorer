"use client";

import { useState, useRef, useEffect } from "react";
import Script from "next/script";
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
  // You can keep searchQuery for filtering properties (if desired)
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState(10000000);
  const [statusFilter, setStatusFilter] = useState("all");
  // New state for full place details from the picker
  const [selectedPlace, setSelectedPlace] = useState(null);

  // Refs for map and related objects
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const infoWindowRef = useRef(null);

  // Initialize the map (centered on India)
  const initMap = () => {
    if (mapRef.current && window.google) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 22.5937, lng: 78.9629 },
        zoom: 5,
      });
      mapInstanceRef.current = map;
      markerRef.current = new window.google.maps.Marker({ map });
      infoWindowRef.current = new window.google.maps.InfoWindow();
    }
  };

  // When a new place is selected via the place-picker, update the map
  useEffect(() => {
    if (selectedPlace && mapInstanceRef.current) {
      const map = mapInstanceRef.current;
      // If a viewport is provided, fit bounds; otherwise, recenter and zoom in.
      if (selectedPlace.viewport) {
        map.fitBounds(selectedPlace.viewport);
      } else if (selectedPlace.location) {
        map.setCenter(selectedPlace.location);
        map.setZoom(17);
      }
      // Update marker position
      if (markerRef.current) {
        markerRef.current.setPosition(selectedPlace.location);
      }
      // Update and open info window with place details
      if (infoWindowRef.current) {
        const content = `<strong>${selectedPlace.displayName || ""
          }</strong><br><span>${selectedPlace.formattedAddress || ""}</span>`;
        infoWindowRef.current.setContent(content);
        infoWindowRef.current.open(map, markerRef.current);
      }
    }
  }, [selectedPlace]);

  // Run initMap when the component mounts
  useEffect(() => {
    if (window.google && mapRef.current) {
      initMap();
    }
  }, []);

  const filteredProperties = properties.filter(
    (property) =>
      property.address.toLowerCase().includes(searchQuery.toLowerCase()) &&
      property.price <= priceRange &&
      (statusFilter === "all" ||
        (statusFilter === "available" && property.available) ||
        (statusFilter === "sold" && !property.available))
  );

  const toggleLike = (id) => {
    setProperties((prev) =>
      prev.map((property) =>
        property.id === id
          ? { ...property, liked: !property.liked }
          : property
      )
    );
  };

  return (
    <>
      {/* Load the Google Maps API with Places library */}
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyBTKErUXNmnM9w2aMZogUNDqFWr5Qu1Elc&libraries=places`}
        strategy="beforeInteractive"
      />
      {/* Load the Extended Component Library for gmpx components */}
      <Script
        type="module"
        src="https://ajax.googleapis.com/ajax/libs/@googlemaps/extended-component-library/0.6.11/index.min.js"
        strategy="beforeInteractive"
      />

      <main className="p-6 max-w-full mx-auto bg-gradient-to-br from-gray-900 via-gray-800 to-black min-h-screen">
        <div className="flex justify-center mb-4 mt-20">
          {/* Use the updated SearchLocation component which fires full place data */}
          <SearchLocation setPlace={setSelectedPlace} />
        </div>

        {/* Map Container */}
        <div
          ref={mapRef}
          className="relative w-full h-[500px] bg-gray-700 flex items-center justify-center rounded-lg shadow-lg mb-6"
        >
          {/* The Google Map will render here */}
        </div>

        {/* Property Filtering Controls */}
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

        {/* Display Properties */}
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
    </>
  );
}
