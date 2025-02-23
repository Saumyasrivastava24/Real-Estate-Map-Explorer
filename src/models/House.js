import mongoose from "mongoose";

const HouseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    propertyType: {
      type: String,
      enum: ["house", "apartment", "villa", "condo", "townhouse", "land"],
      default: "house",
    },
    listingType: {
      type: String,
      enum: ["rent", "sell"],
      default: "sell",
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: false,
    },
    state: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      default: "India",
    },
    price: {
      type: Number,
      required: true,
    },
    bedrooms: {
      type: Number,
      required: false,
    },
    bathrooms: {
      type: Number,
      required: false,
    },
    squareFeet: {
      type: Number,
      required: false,
    },
    images: {
      type: [String],
      default: [],
    },
    // Optionally track who created/owns the listing
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
  },
  { timestamps: true }
);

// Avoid recompiling model upon every hot reload in dev
export default mongoose.models.House || mongoose.model("House", HouseSchema);
