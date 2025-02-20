"use client";

import React from "react";

export default function AboutUs() {
  return (
    <main className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6">
      {/* Container with border, shadow, and padding */}
      <div className="max-w-3xl mx-auto mt-16 p-8 border border-neutral-700 rounded-lg shadow-sm shadow-slate-200">
        {/* Main Heading + Decorative Line */}
        <h1 className="text-4xl font-bold text-center mb-2">About Us</h1>
        <div className="w-full h-0.5 bg-blue-600 mx-auto mb-6"></div>

        <p className="text-neutral-200 text-lg mb-6 leading-relaxed">
          Welcome to our real estate platform, where you can effortlessly browse
          and discover a wide range of properties—whether they are available for
          sale or have already been sold. Our goal is to simplify your property
          search by providing a centralized hub with detailed information on
          each listing, including pricing, availability, and precise locations
          on an interactive map.
        </p>

        <h2 className="text-2xl font-semibold text-white mt-8 mb-4">
          Our Mission
        </h2>
        <p className="text-neutral-200 text-lg mb-6 leading-relaxed">
          We aim to empower homebuyers, sellers, and real estate enthusiasts
          with an intuitive platform that eliminates the stress of property
          hunting. Whether you&apos;re looking for a modern apartment, a luxury
          villa, or anything in between, we&apos;re here to help you find the perfect
          match with minimal effort.
        </p>

        <h2 className="text-2xl font-semibold text-white mt-8 mb-4">
          How It Works
        </h2>
        <ul className="list-disc list-inside space-y-4 text-neutral-200 text-lg leading-relaxed">
          <li>
            <span className="font-semibold text-white">Explore Listings:</span>{" "}
            Browse through our curated list of houses and apartments. Each
            listing shows key details such as price, availability status, and
            images.
          </li>
          <li>
            <span className="font-semibold text-white">Interactive Map:</span>{" "}
            Use our built-in Google Maps integration to see exactly where each
            property is located. This helps you gauge the neighborhood, nearby
            amenities, and travel distances.
          </li>
          <li>
            <span className="font-semibold text-white">Filter & Search:</span>{" "}
            Narrow down results by price range, location, or status (available /
            sold). You can also type a location or keyword in the search bar to
            quickly find relevant listings.
          </li>
          <li>
            <span className="font-semibold text-white">Like or Save:</span> If
            you come across a property that catches your eye, you can “like” it
            to keep track. This makes it easy to revisit your favorite options
            later.
          </li>
          <li>
            <span className="font-semibold text-white">Stay Updated:</span> Our
            platform is regularly updated with new listings and the latest
            prices, so you&apos;ll always have access to current information.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold text-white mt-8 mb-4">
          Why Choose Us?
        </h2>
        <p className="text-neutral-200 text-lg mb-6 leading-relaxed">
          We focus on delivering a user-friendly experience. Our streamlined
          interface, interactive map, and detailed property information ensure
          that you spend less time searching and more time deciding which
          listing fits your needs best. Whether you&apos;re a first-time buyer or a
          seasoned investor, we&apos;re confident our platform will make your real
          estate journey smoother and more efficient.
        </p>

        <p className="text-neutral-200 text-lg leading-relaxed">
          Thank you for choosing our website for your property search. We hope you find your dream home or the perfect investment opportunity!
        </p>
      </div>
    </main>
  );
}
