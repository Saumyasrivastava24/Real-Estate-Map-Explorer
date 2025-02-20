"use client";

import React from "react";

export default function ContactUsPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <p className="text-lg text-neutral-300 mb-2">
        For any inquiries or assistance, please reach out:
      </p>
      <p className="text-lg text-blue-400">
        <a href="mailto:contact@realestate.com">contact@realestate.com</a>
      </p>
    </div>
  );
}
