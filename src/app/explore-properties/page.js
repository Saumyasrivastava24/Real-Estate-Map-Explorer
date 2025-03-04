"use client";

import { useState, useRef, useEffect } from "react";
import Script from "next/script";
import PropertyCard from "../components/PropertyCard";
import SearchLocation from "../components/SearchLocation";

export default function ExploreProperties() {
  // Initialize properties state as an empty array.
  const [properties, setProperties] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState(50000000);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPlace, setSelectedPlace] = useState(null);

  // Refs for map and related objects
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const infoWindowRef = useRef(null);
  // Ref to hold all property markers on the map
  const propertyMarkersRef = useRef([]);

  // Function to initialize the map (centered on India by default)
  const initMap = () => {
    if (mapRef.current && window.google) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 22.5937, lng: 78.9629 },
        zoom: 5,
      });
      mapInstanceRef.current = map;
      markerRef.current = new window.google.maps.Marker({ map });
      infoWindowRef.current = new window.google.maps.InfoWindow();

      // Add markers (if properties already exist)
      addPropertyMarkers();
    }
  };

  // Helper function to add markers for each property
  const addPropertyMarkers = () => {
    if (mapInstanceRef.current && window.google) {
      // Remove existing markers
      propertyMarkersRef.current.forEach((marker) => marker.setMap(null));
      propertyMarkersRef.current = [];

      properties.forEach((property) => {
        if (
          property.location &&
          typeof property.location.lat === "number" &&
          typeof property.location.lng === "number"
        ) {
          const marker = new window.google.maps.Marker({
            position: property.location,
            map: mapInstanceRef.current,
            // Use a special icon for the house markers
            icon: {
              url: "/house.png",
              scaledSize: new window.google.maps.Size(35, 35),
            }
          });
          // On marker click, display an info window with property details
          marker.addListener("click", () => {
            if (infoWindowRef.current) {
              infoWindowRef.current.setContent(
                `<div><strong>${property.title}</strong><br/>${property.address}</div>`
              );
              infoWindowRef.current.open(mapInstanceRef.current, marker);
            }
          });
          propertyMarkersRef.current.push(marker);
        }
      });

      // Adjust the map bounds so that all markers are visible
      if (propertyMarkersRef.current.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        propertyMarkersRef.current.forEach((marker) => {
          bounds.extend(marker.getPosition());
        });
        mapInstanceRef.current.fitBounds(bounds);
      }
    }
  };

  // Geocode addresses for properties that lack location data
  const updatePropertiesWithCoordinates = async (props) => {
    const geocoder = new window.google.maps.Geocoder();
    const promises = props.map((property) => {
      // If location already exists, return as is.
      if (property.location) return Promise.resolve(property);

      return new Promise((resolve) => {
        geocoder.geocode({ address: property.address }, (results, status) => {
          if (status === "OK" && results[0]) {
            // Convert location to plain object { lat, lng }
            property.location = results[0].geometry.location.toJSON();
          } else {
            console.error(
              `Geocoding failed for address: ${property.address} (${status})`
            );
          }
          resolve(property);
        });
      });
    });
    return Promise.all(promises);
  };

  // Fetch properties from the API on component mount
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch("/api/houses");
        const result = await response.json();
        if (result.success) {
          setProperties(result.data);
        } else {
          console.error("Error fetching houses:", result.error);
        }
      } catch (error) {
        console.error("Error fetching houses:", error);
      }
    };
    fetchProperties();
  }, []);

  // Once properties are fetched and if the map is loaded, geocode addresses if needed.
  useEffect(() => {
    if (properties.length > 0 && window.google && mapInstanceRef.current) {
      // Check if any property is missing a location
      if (properties.some((p) => !p.location)) {
        updatePropertiesWithCoordinates(properties).then((updatedProps) => {
          setProperties(updatedProps);
        });
      }
    }
  }, [properties]);

  // Whenever properties update, re-add markers on the map
  useEffect(() => {
    if (mapInstanceRef.current && window.google) {
      addPropertyMarkers();
    }
  }, [properties]);

  // Update the map when a new place is selected via the search component
  useEffect(() => {
    if (selectedPlace && mapInstanceRef.current) {
      const map = mapInstanceRef.current;
      if (selectedPlace.viewport) {
        map.fitBounds(selectedPlace.viewport);
      } else if (selectedPlace.location) {
        map.setCenter(selectedPlace.location);
        map.setZoom(17);
      }
      if (markerRef.current) {
        markerRef.current.setPosition(selectedPlace.location);
      }
      if (infoWindowRef.current) {
        const content = `<strong>${selectedPlace.displayName || ""
          }</strong><br><span>${selectedPlace.formattedAddress || ""
          }</span>`;
        infoWindowRef.current.setContent(content);
        infoWindowRef.current.open(map, markerRef.current);
      }
    }
  }, [selectedPlace]);

  // Filter properties for grid view; note that markers always show all houses.
  const filteredProperties = properties.filter(
    (property) =>
      property.address.toLowerCase().includes(searchQuery.toLowerCase()) &&
      property.price <= priceRange &&
      (statusFilter === "all" ||
        (statusFilter === "available" && property.available) ||
        (statusFilter === "sold" && !property.available))
  );

  // Toggle like functionality using the unique _id field
  const toggleLike = (_id) => {
    setProperties((prev) =>
      prev.map((property) =>
        property._id === _id ? { ...property, liked: !property.liked } : property
      )
    );
  };

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyBTKErUXNmnM9w2aMZogUNDqFWr5Qu1Elc&libraries=places`}
        strategy="afterInteractive"
        async
        onLoad={initMap}
      />
      <Script
        type="module"
        src="https://ajax.googleapis.com/ajax/libs/@googlemaps/extended-component-library/0.6.11/index.min.js"
        strategy="afterInteractive"
        crossorigin="anonymous"
      />


      <main className="p-6 max-w-full mx-auto bg-gradient-to-br from-gray-900 via-gray-800 to-black min-h-screen">
        <div className="flex justify-center mb-4 mt-20">
          <SearchLocation setPlace={setSelectedPlace} />
        </div>

        <div
          ref={mapRef}
          className="relative w-full h-[500px] bg-gray-700 flex items-center justify-center rounded-lg shadow-lg mb-6"
        >
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

        {/* Display Properties Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <PropertyCard
                key={property._id}
                property={property}
                onToggleLike={() => toggleLike(property._id)}
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
