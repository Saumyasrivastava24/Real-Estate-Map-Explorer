"use client";

import { useState, useRef, useEffect } from "react";
import Script from "next/script";
import PropertyCard from "../components/PropertyCard";
import SearchLocation from "../components/SearchLocation";

export default function ExploreProperties() {
  const [properties, setProperties] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState(50000000);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPlace, setSelectedPlace] = useState(null);

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const infoWindowRef = useRef(null);
  const propertyMarkersRef = useRef([]);

  const initMap = () => {
    if (mapRef.current && window.google) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 22.5937, lng: 78.9629 },
        zoom: 5,
      });
      mapInstanceRef.current = map;
      markerRef.current = new window.google.maps.Marker({ map });
      infoWindowRef.current = new window.google.maps.InfoWindow();
      addPropertyMarkers();
    }
  };

  const addPropertyMarkers = () => {
    if (!mapInstanceRef.current || !window.google) return;

    // Clear existing markers
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
          icon: {
            url: "/house.png",
            scaledSize: new window.google.maps.Size(35, 35),
          },
        });

        marker.addListener("click", () => {
          if (!infoWindowRef.current) return;

          // Build custom info window content
          const infoId = `info-content-${property._id}`;
          const iconId = `icon-${property._id}`;
          const content = `
            <div id="${infoId}" style="max-width:200px;">
              <strong>${property.title}</strong><br/>
              <span>${property.address}</span><br/>
              <img 
                id="${iconId}" 
                src="/arrow-right.svg" 
                alt="View details" 
                style="width:20px;height:20px;cursor:pointer;margin-top:5px;" 
              />
            </div>
          `;

          infoWindowRef.current.setContent(content);
          infoWindowRef.current.open(mapInstanceRef.current, marker);

          // Attach click handler once DOM is ready
          window.google.maps.event.addListenerOnce(
            infoWindowRef.current,
            'domready',
            () => {
              const iconEl = document.getElementById(iconId);
              if (iconEl) {
                iconEl.addEventListener('click', () => {
                  window.location.href = `/property/${property._id}`;
                });
              }
            }
          );
        });

        propertyMarkersRef.current.push(marker);
      }
    });

    // Fit bounds
    if (propertyMarkersRef.current.length) {
      const bounds = new window.google.maps.LatLngBounds();
      propertyMarkersRef.current.forEach((m) => bounds.extend(m.getPosition()));
      mapInstanceRef.current.fitBounds(bounds);
    }
  };

  const updatePropertiesWithCoordinates = async (props) => {
    const geocoder = new window.google.maps.Geocoder();
    const promises = props.map((property) => {
      if (property.location) return Promise.resolve(property);
      return new Promise((resolve) => {
        geocoder.geocode({ address: property.address }, (results, status) => {
          if (status === "OK" && results[0]) {
            property.location = results[0].geometry.location.toJSON();
          }
          resolve(property);
        });
      });
    });
    return Promise.all(promises);
  };

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch("/api/houses");
        const result = await res.json();
        if (result.success) setProperties(result.data);
        else console.error("Error fetching houses:", result.error);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchProperties();
  }, []);

  useEffect(() => {
    if (properties.length && window.google && mapInstanceRef.current) {
      if (properties.some((p) => !p.location)) {
        updatePropertiesWithCoordinates(properties).then(setProperties);
      }
    }
  }, [properties]);

  useEffect(() => {
    if (mapInstanceRef.current && window.google) addPropertyMarkers();
  }, [properties]);

  useEffect(() => {
    if (selectedPlace && mapInstanceRef.current) {
      const map = mapInstanceRef.current;
      if (selectedPlace.viewport) {
        map.fitBounds(selectedPlace.viewport);
      } else if (selectedPlace.location) {
        map.setCenter(selectedPlace.location);
        map.setZoom(17);
      }
      if (markerRef.current) markerRef.current.setPosition(selectedPlace.location);
      if (infoWindowRef.current) {
        const content = `<strong>${selectedPlace.displayName || ""}</strong><br/><span>${selectedPlace.formattedAddress || ""}</span>`;
        infoWindowRef.current.setContent(content);
        infoWindowRef.current.open(map, markerRef.current);
      }
    }
  }, [selectedPlace]);

  const filteredProperties = properties.filter(
    (property) =>
      property.address.toLowerCase().includes(searchQuery.toLowerCase()) &&
      property.price <= priceRange &&
      (statusFilter === "all" ||
        (statusFilter === "available" && property.available) ||
        (statusFilter === "sold" && !property.available))
  );

  const toggleLike = (_id) => {
    setProperties((prev) =>
      prev.map((p) => (p._id === _id ? { ...p, liked: !p.liked } : p))
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
          className="w-full h-[500px] bg-gray-700 flex items-center justify-center rounded-lg shadow-lg mb-6"
        />

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
            <label className="text-gray-300">Max Price: ₹{priceRange.toLocaleString()}</label>
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
                key={property._id}
                property={property}
                onToggleLike={() => toggleLike(property._id)}
              />
            ))
          ) : (
            <p className="text-gray-300 col-span-full text-center">No properties found.</p>
          )}
        </div>
      </main>
    </>
  );
}
