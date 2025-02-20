import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    // roles: "user" or "dealer"
    role: {
      type: String,
      enum: ["user", "dealer"],
      default: "user",
    },
  },
  { timestamps: true }
);

// Avoid recompiling model upon every hot reload in dev
export default mongoose.models.User || mongoose.model("User", UserSchema);
