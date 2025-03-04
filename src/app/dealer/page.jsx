"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import Script from "next/script";

export default function ManageHouses() {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newHouse, setNewHouse] = useState({
    title: "",
    propertyType: "house",
    listingType: "sell",
    address: "",
    city: "",
    state: "",
    country: "India",
    price: "",
    bedrooms: "",
    bathrooms: "",
    squareFeet: "",
    images: "",
  });
  const [newHouseSuggestions, setNewHouseSuggestions] = useState([]);
  const [editingHouseId, setEditingHouseId] = useState(null);
  const [editHouse, setEditHouse] = useState({
    title: "",
    propertyType: "house",
    listingType: "sell",
    address: "",
    city: "",
    state: "",
    country: "India",
    price: "",
    bedrooms: "",
    bathrooms: "",
    squareFeet: "",
    images: "",
  });
  const [editHouseSuggestions, setEditHouseSuggestions] = useState([]);

  // Refs to store our AutocompleteService instances
  const autocompleteService = useRef(null);
  const editAutocompleteService = useRef(null);

  useEffect(() => {
    fetchHouses();
  }, []);

  async function fetchHouses() {
    setLoading(true);
    try {
      const res = await fetch("/api/houses");
      const data = await res.json();
      if (data.success) {
        setHouses(data.data);
      }
    } catch (error) {
      console.error("Error fetching houses:", error);
    } finally {
      setLoading(false);
    }
  }

  const errorToast = (message) => toast.error(message);

  async function handleCreate(e) {
    e.preventDefault();
    const payload = {
      ...newHouse,
      images: newHouse.images
        .split(",")
        .map((url) => url.trim())
        .filter((url) => url !== ""),
    };
    try {
      const res = await fetch("/api/houses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      if (data.success) {
        setNewHouse({
          title: "",
          propertyType: "house",
          listingType: "sell",
          address: "",
          city: "",
          state: "",
          country: "India",
          price: "",
          bedrooms: "",
          bathrooms: "",
          squareFeet: "",
          images: "",
        });
        setNewHouseSuggestions([]);
        fetchHouses();
        toast.success("House added successfully");
      }
    } catch (error) {
      errorToast(error.message);
    }
  }

  function startEditing(house) {
    setEditingHouseId(house._id);
    setEditHouse({
      title: house.title,
      propertyType: house.propertyType,
      listingType: house.listingType,
      address: house.address,
      city: house.city || "",
      state: house.state || "",
      country: house.country || "India",
      price: house.price,
      bedrooms: house.bedrooms || "",
      bathrooms: house.bathrooms || "",
      squareFeet: house.squareFeet || "",
      images: house.images ? house.images.join(", ") : "",
    });
    setEditHouseSuggestions([]);
  }

  async function handleUpdate(e) {
    e.preventDefault();
    const payload = {
      ...editHouse,
      images: editHouse.images
        .split(",")
        .map((url) => url.trim())
        .filter((url) => url !== ""),
    };
    try {
      const res = await fetch(`/api/houses/${editingHouseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setEditingHouseId(null);
        setEditHouse({
          title: "",
          propertyType: "house",
          listingType: "sell",
          address: "",
          city: "",
          state: "",
          country: "India",
          price: "",
          bedrooms: "",
          bathrooms: "",
          squareFeet: "",
          images: "",
        });
        setEditHouseSuggestions([]);
        fetchHouses();
      }
    } catch (error) {
      console.error("Error updating house:", error);
    }
  }

  async function handleDelete(id) {
    try {
      const res = await fetch(`/api/houses/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchHouses();
        toast.success("House deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting house:", error);
      toast.error("Error deleting house");
    }
  }

  // Initialize AutocompleteService for newHouse suggestions
  useEffect(() => {
    if (window.google && !autocompleteService.current) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
    }
  }, []);

  // Fetch newHouse address suggestions as the user types
  useEffect(() => {
    if (newHouse.address && autocompleteService.current) {
      autocompleteService.current.getPlacePredictions(
        { input: newHouse.address, componentRestrictions: { country: "in" } },
        (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            setNewHouseSuggestions(predictions);
          } else {
            setNewHouseSuggestions([]);
          }
        }
      );
    } else {
      setNewHouseSuggestions([]);
    }
  }, [newHouse.address]);

  // Initialize AutocompleteService for editHouse suggestions
  useEffect(() => {
    if (window.google && !editAutocompleteService.current) {
      editAutocompleteService.current = new window.google.maps.places.AutocompleteService();
    }
  }, []);

  // Fetch editHouse address suggestions as the user types
  useEffect(() => {
    if (editHouse.address && editAutocompleteService.current) {
      editAutocompleteService.current.getPlacePredictions(
        { input: editHouse.address, componentRestrictions: { country: "in" } },
        (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            setEditHouseSuggestions(predictions);
          } else {
            setEditHouseSuggestions([]);
          }
        }
      );
    } else {
      setEditHouseSuggestions([]);
    }
  }, [editHouse.address]);

  // When a suggestion is selected in the newHouse form
  const handleSelectNewHouseSuggestion = (suggestion) => {
    // Update the address immediately
    setNewHouse((prev) => ({
      ...prev,
      address: suggestion.description,
    }));
    setNewHouseSuggestions([]);
    // Fetch full details using the PlacesService
    const service = new window.google.maps.places.PlacesService(document.createElement("div"));
    service.getDetails({ placeId: suggestion.place_id }, (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && place.address_components) {
        const city = place.address_components.find((comp) =>
          comp.types.includes("locality")
        )?.long_name || "";
        const state = place.address_components.find((comp) =>
          comp.types.includes("administrative_area_level_1")
        )?.long_name || "";
        const country = place.address_components.find((comp) =>
          comp.types.includes("country")
        )?.long_name || "India";

        // Fetch photo URL if available using getUrl()
        let photoUrl = "";
        if (place.photos && place.photos.length > 0) {
          photoUrl = place.photos[0].getUrl({ maxWidth: 400 });
        }

        // Update the state with the additional details including image URL
        setNewHouse((prev) => ({
          ...prev,
          city,
          state,
          country,
          images: photoUrl, // Set the photo URL here
        }));
      }
    });
  };

  // Similarly, for the editHouse form
  const handleSelectEditHouseSuggestion = (suggestion) => {
    setEditHouse((prev) => ({
      ...prev,
      address: suggestion.description,
    }));
    setEditHouseSuggestions([]);
    const service = new window.google.maps.places.PlacesService(document.createElement("div"));
    service.getDetails({ placeId: suggestion.place_id }, (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && place.address_components) {
        const city = place.address_components.find((comp) =>
          comp.types.includes("locality")
        )?.long_name || "";
        const state = place.address_components.find((comp) =>
          comp.types.includes("administrative_area_level_1")
        )?.long_name || "";
        const country = place.address_components.find((comp) =>
          comp.types.includes("country")
        )?.long_name || "India";

        let photoUrl = "";
        if (place.photos && place.photos.length > 0) {
          photoUrl = place.photos[0].getUrl({ maxWidth: 400 });
        }

        setEditHouse((prev) => ({
          ...prev,
          city,
          state,
          country,
          images: photoUrl,
        }));
      }
    });
  };


  return (
    <>
      {/* Load Google Maps API with Places library */}
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyBTKErUXNmnM9w2aMZogUNDqFWr5Qu1Elc&libraries=places`}
        strategy="beforeInteractive"
      />
      <ToastContainer />
      <main className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6 pt-20">
        <h1 className="text-3xl font-bold mb-6">Manage Houses</h1>

        {/* Create New House */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Add New House</h2>
          <form onSubmit={handleCreate} className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Title:</label>
                <input
                  type="text"
                  value={newHouse.title}
                  onChange={(e) => setNewHouse({ ...newHouse, title: e.target.value })}
                  className="bg-gray-700 border border-gray-600 p-2 w-full text-white rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Property Type:</label>
                <select
                  value={newHouse.propertyType}
                  onChange={(e) => setNewHouse({ ...newHouse, propertyType: e.target.value })}
                  className="bg-gray-700 border border-gray-600 p-2 w-full text-white rounded"
                >
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="condo">Condo</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="land">Land</option>
                </select>
              </div>
              <div>
                <label className="block mb-1">Listing Type:</label>
                <select
                  value={newHouse.listingType}
                  onChange={(e) => setNewHouse({ ...newHouse, listingType: e.target.value })}
                  className="bg-gray-700 border border-gray-600 p-2 w-full text-white rounded"
                >
                  <option value="rent">Rent</option>
                  <option value="sell">Sell</option>
                </select>
              </div>
              <div className="relative">
                <label className="block mb-1">Address:</label>
                <input
                  type="text"
                  value={newHouse.address}
                  onChange={(e) => setNewHouse({ ...newHouse, address: e.target.value })}
                  className="bg-gray-700 border border-gray-600 p-2 w-full text-white rounded"
                  required
                  placeholder="Enter address"
                />
                {newHouseSuggestions.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white text-black rounded shadow-lg mt-1 max-h-60 overflow-auto">
                    {newHouseSuggestions.map((suggestion) => (
                      <li
                        key={suggestion.place_id}
                        onClick={() => handleSelectNewHouseSuggestion(suggestion)}
                        className="p-2 cursor-pointer hover:bg-gray-200"
                      >
                        {suggestion.description}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <label className="block mb-1">City:</label>
                <input
                  type="text"
                  value={newHouse.city}
                  onChange={(e) => setNewHouse({ ...newHouse, city: e.target.value })}
                  className="bg-gray-700 border border-gray-600 p-2 w-full text-white rounded"
                />
              </div>
              <div>
                <label className="block mb-1">State:</label>
                <input
                  type="text"
                  value={newHouse.state}
                  onChange={(e) => setNewHouse({ ...newHouse, state: e.target.value })}
                  className="bg-gray-700 border border-gray-600 p-2 w-full text-white rounded"
                />
              </div>
              <div>
                <label className="block mb-1">Country:</label>
                <input
                  type="text"
                  value={newHouse.country}
                  onChange={(e) => setNewHouse({ ...newHouse, country: e.target.value })}
                  className="bg-gray-700 border border-gray-600 p-2 w-full text-white rounded"
                />
              </div>
              <div>
                <label className="block mb-1">Price:</label>
                <input
                  type="number"
                  value={newHouse.price}
                  onChange={(e) => setNewHouse({ ...newHouse, price: e.target.value })}
                  className="bg-gray-700 border border-gray-600 p-2 w-full text-white rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Bedrooms:</label>
                <input
                  type="number"
                  value={newHouse.bedrooms}
                  onChange={(e) => setNewHouse({ ...newHouse, bedrooms: e.target.value })}
                  className="bg-gray-700 border border-gray-600 p-2 w-full text-white rounded"
                />
              </div>
              <div>
                <label className="block mb-1">Bathrooms:</label>
                <input
                  type="number"
                  value={newHouse.bathrooms}
                  onChange={(e) => setNewHouse({ ...newHouse, bathrooms: e.target.value })}
                  className="bg-gray-700 border border-gray-600 p-2 w-full text-white rounded"
                />
              </div>
              <div>
                <label className="block mb-1">Square Feet:</label>
                <input
                  type="number"
                  value={newHouse.squareFeet}
                  onChange={(e) => setNewHouse({ ...newHouse, squareFeet: e.target.value })}
                  className="bg-gray-700 border border-gray-600 p-2 w-full text-white rounded"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-1">Images (comma separated URLs):</label>
                <input
                  type="text"
                  value={newHouse.images}
                  onChange={(e) => setNewHouse({ ...newHouse, images: e.target.value })}
                  className="bg-gray-700 border border-gray-600 p-2 w-full text-white rounded"
                />
              </div>
            </div>
            <button type="submit" className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded">
              Add House
            </button>
          </form>
        </div>

        {/* List Houses */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Houses List</h2>
          {loading ? (
            <p>Loading...</p>
          ) : houses.length === 0 ? (
            <p>No houses available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {houses.map((house, index) => (
                <motion.div
                  key={house._id}
                  className="bg-gray-800 p-6 rounded-lg shadow-lg h-fit"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {editingHouseId === house._id ? (
                    <form onSubmit={handleUpdate}>
                      {/* Edit Form */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block mb-1">Title:</label>
                          <input
                            type="text"
                            value={editHouse.title}
                            onChange={(e) =>
                              setEditHouse({ ...editHouse, title: e.target.value })
                            }
                            className="bg-gray-700 border border-gray-600 p-2 w-full text-white rounded"
                            required
                          />
                        </div>
                        <div>
                          <label className="block mb-1">Property Type:</label>
                          <select
                            value={editHouse.propertyType}
                            onChange={(e) =>
                              setEditHouse({ ...editHouse, propertyType: e.target.value })
                            }
                            className="bg-gray-700 border border-gray-600 p-2 w-full text-white rounded"
                          >
                            <option value="house">House</option>
                            <option value="apartment">Apartment</option>
                            <option value="villa">Villa</option>
                            <option value="condo">Condo</option>
                            <option value="townhouse">Townhouse</option>
                            <option value="land">Land</option>
                          </select>
                        </div>
                        <div>
                          <label className="block mb-1">Listing Type:</label>
                          <select
                            value={editHouse.listingType}
                            onChange={(e) =>
                              setEditHouse({ ...editHouse, listingType: e.target.value })
                            }
                            className="bg-gray-700 border border-gray-600 p-2 w-full text-white rounded"
                          >
                            <option value="rent">Rent</option>
                            <option value="sell">Sell</option>
                          </select>
                        </div>
                        <div className="relative">
                          <label className="block mb-1">Address:</label>
                          <input
                            type="text"
                            value={editHouse.address}
                            onChange={(e) =>
                              setEditHouse({ ...editHouse, address: e.target.value })
                            }
                            className="bg-gray-700 border border-gray-600 p-2 w-full text-white rounded"
                            required
                            placeholder="Enter address"
                          />
                          {editHouseSuggestions.length > 0 && (
                            <ul className="absolute z-10 w-full bg-white text-black rounded shadow-lg mt-1 max-h-60 overflow-auto">
                              {editHouseSuggestions.map((suggestion) => (
                                <li
                                  key={suggestion.place_id}
                                  onClick={() =>
                                    handleSelectEditHouseSuggestion(suggestion)
                                  }
                                  className="p-2 cursor-pointer hover:bg-gray-200"
                                >
                                  {suggestion.description}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                        <div>
                          <label className="block mb-1">City:</label>
                          <input
                            type="text"
                            value={editHouse.city}
                            onChange={(e) =>
                              setEditHouse({ ...editHouse, city: e.target.value })
                            }
                            className="bg-gray-700 border border-gray-600 p-2 w-full text-white rounded"
                          />
                        </div>
                        <div>
                          <label className="block mb-1">State:</label>
                          <input
                            type="text"
                            value={editHouse.state}
                            onChange={(e) =>
                              setEditHouse({ ...editHouse, state: e.target.value })
                            }
                            className="bg-gray-700 border border-gray-600 p-2 w-full text-white rounded"
                          />
                        </div>
                        <div>
                          <label className="block mb-1">Country:</label>
                          <input
                            type="text"
                            value={editHouse.country}
                            onChange={(e) =>
                              setEditHouse({ ...editHouse, country: e.target.value })
                            }
                            className="bg-gray-700 border border-gray-600 p-2 w-full text-white rounded"
                          />
                        </div>
                        <div>
                          <label className="block mb-1">Price:</label>
                          <input
                            type="number"
                            value={editHouse.price}
                            onChange={(e) =>
                              setEditHouse({ ...editHouse, price: e.target.value })
                            }
                            className="bg-gray-700 border border-gray-600 p-2 w-full text-white rounded"
                            required
                          />
                        </div>
                        <div>
                          <label className="block mb-1">Bedrooms:</label>
                          <input
                            type="number"
                            value={editHouse.bedrooms}
                            onChange={(e) =>
                              setEditHouse({ ...editHouse, bedrooms: e.target.value })
                            }
                            className="bg-gray-700 border border-gray-600 p-2 w-full text-white rounded"
                          />
                        </div>
                        <div>
                          <label className="block mb-1">Bathrooms:</label>
                          <input
                            type="number"
                            value={editHouse.bathrooms}
                            onChange={(e) =>
                              setEditHouse({ ...editHouse, bathrooms: e.target.value })
                            }
                            className="bg-gray-700 border border-gray-600 p-2 w-full text-white rounded"
                          />
                        </div>
                        <div>
                          <label className="block mb-1">Square Feet:</label>
                          <input
                            type="number"
                            value={editHouse.squareFeet}
                            onChange={(e) =>
                              setEditHouse({ ...editHouse, squareFeet: e.target.value })
                            }
                            className="bg-gray-700 border border-gray-600 p-2 w-full text-white rounded"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block mb-1">
                            Images (comma separated URLs):
                          </label>
                          <input
                            type="text"
                            value={editHouse.images}
                            onChange={(e) =>
                              setEditHouse({ ...editHouse, images: e.target.value })
                            }
                            className="bg-gray-700 border border-gray-600 p-2 w-full text-white rounded"
                          />
                        </div>
                      </div>
                      <div className="flex space-x-4 mt-4">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingHouseId(null)}
                          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div>
                      {/* Display image if available */}
                      {house.images && (
                        <>
                          {typeof house.images === "string" &&
                            house.images.trim() !== "" && (
                              <img
                                src={house.images.split(",")[0].trim()}
                                alt={house.title}
                                className="w-full h-48 object-cover mb-4 rounded"
                              />
                            )}
                          {Array.isArray(house.images) && house.images.length > 0 && (
                            <img
                              src={house.images[0]}
                              alt={house.title}
                              className="w-full h-48 object-cover mb-4 rounded"
                            />
                          )}
                        </>
                      )}
                      <h3 className="text-xl font-bold mb-2">{house.title}</h3>
                      <p className="mb-1">
                        <span className="font-semibold">Type:</span>{" "}
                        {house.propertyType}
                      </p>
                      <p className="mb-1">
                        <span className="font-semibold">Listing:</span>{" "}
                        {house.listingType}
                      </p>
                      <p className="mb-1">
                        <span className="font-semibold">Address:</span>{" "}
                        {house.address}
                      </p>
                      <p className="mb-1">
                        <span className="font-semibold">Price:</span> ₹{house.price}
                      </p>
                      <p className="mb-1">
                        <span className="font-semibold">Bedrooms:</span>{" "}
                        {house.bedrooms || "N/A"}
                      </p>
                      <p className="mb-1">
                        <span className="font-semibold">Bathrooms:</span>{" "}
                        {house.bathrooms || "N/A"}
                      </p>
                      <p className="mb-1">
                        <span className="font-semibold">Square Feet:</span>{" "}
                        {house.squareFeet || "N/A"}
                      </p>
                      <div className="flex space-x-4 mt-2">
                        <button
                          onClick={() => startEditing(house)}
                          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(house._id)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
