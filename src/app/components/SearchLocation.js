"use client";

import React, { useEffect, useRef } from "react";

export default function SearchLocation({ setPlace }) {
  const placePickerRef = useRef(null);

  useEffect(() => {
    const picker = placePickerRef.current;
    if (picker) {
      const handlePlaceChange = () => {
        // gmpx-place-picker exposes the selected place via its `value` property
        const place = picker.value;
        setPlace(place);
      };
      picker.addEventListener("gmpx-placechange", handlePlaceChange);
      return () => {
        picker.removeEventListener("gmpx-placechange", handlePlaceChange);
      };
    }
  }, [setPlace]);

  return (
    <gmpx-place-picker
      ref={placePickerRef}
      placeholder="Enter an address"
      style={{
        width: "100%",
        maxWidth: "640px",
        padding: "0.5rem",
        borderRadius: "0.25rem",
        border: "1px solid #4B5563",
        background: "#1F2937",
        color: "#F3F4F6",
      }}
    ></gmpx-place-picker>
  );
}
