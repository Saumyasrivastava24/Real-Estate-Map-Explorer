"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function PropertyPage() {
    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;

        fetch(`/api/houses/${id}`)
            .then((res) => res.json())
            .then((result) => {
                if (result.success && result.data) {
                    setProperty(result.data);
                } else {
                    setError("Property not found.");
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError("Failed to load property.");
                setLoading(false);
            });
    }, [id]);

    if (loading)
        return (
            <div className="flex justify-center items-center h-screen text-xl">
                Loading...
            </div>
        );
    if (error)
        return (
            <div className="flex justify-center items-center h-screen text-xl">
                {error}
            </div>
        );

    // Use first image if available, otherwise a fallback
    const fallbackImage =
        "/not-found.png"; 
    const imageUrl =
        property.images && property.images.length > 0 ? property.images[0] : fallbackImage;

    return (
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6">
            <main className="max-w-6xl mx-auto p-6 bg-gray-800 bg-opacity-90 rounded-lg shadow-lg">
                <Link href="/explore-properties" className="text-blue-400 hover:underline">
                    ← Back to properties
                </Link>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column: Image */}
                    <div className="relative h-96 w-full rounded-lg overflow-hidden object-contain">
                        <Image
                            src={imageUrl}
                            alt={property.title}
                            fill
                            style={{ objectFit: "cover" }}
                            className="rounded-lg"
                            unoptimized
                        />
                    </div>

                    {/* Right Column: Details */}
                    <div className="flex flex-col justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-white">{property.title}</h1>
                            <p className="text-lg text-gray-300 mt-2">{property.address}</p>
                            <p className="text-xl text-white font-semibold mt-4">
                                Price: ₹{property.price.toLocaleString()}
                            </p>
                            <div className="mt-4 grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-300">
                                        <span className="font-bold">Type:</span> {property.propertyType}
                                    </p>
                                    <p className="text-gray-300">
                                        <span className="font-bold">Listing:</span> {property.listingType}
                                    </p>
                                    <p className="text-gray-300">
                                        <span className="font-bold">City:</span> {property.city}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-300">
                                        <span className="font-bold">State:</span> {property.state}
                                    </p>
                                    <p className="text-gray-300">
                                        <span className="font-bold">Country:</span> {property.country}
                                    </p>
                                    <p className="text-gray-300">
                                        <span className="font-bold">Area:</span> {property.squareFeet} sq ft
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4 flex space-x-8">
                                <p className="text-gray-300">
                                    <span className="font-bold">Bedrooms:</span> {property.bedrooms}
                                </p>
                                <p className="text-gray-300">
                                    <span className="font-bold">Bathrooms:</span> {property.bathrooms}
                                </p>
                            </div>
                        </div>
                        <p className="text-gray-400 mt-6 text-sm">
                            Listed on: {new Date(property.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                {/* Optional: Description Section if available */}
                {property.description && (
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold text-white mb-2">Description</h2>
                        <p className="text-gray-300">{property.description}</p>
                    </div>
                )}
            </main>
        </div>
    );
}
