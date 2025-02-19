// PropertyCard.js
export default function PropertyCard({ property, onToggleLike }) {
  return (
    <div className="relative bg-white shadow-lg rounded-lg overflow-hidden">
      <img
        src={property.image}
        alt={property.name}
        className="w-full h-40 object-cover"
      />
      <div className="p-4">
        <h2 className="font-bold text-xl">{property.name}</h2>
        <p className="text-gray-600">{property.address}</p>
        <p className="text-lg font-semibold">
          ₹{property.price.toLocaleString()}
        </p>
      </div>

      {/* Heart Button */}
      <button
        onClick={onToggleLike}
        className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
          property.liked ? "text-red-500" : "text-gray-400"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
          className={`w-6 h-6 ${
            property.liked ? "fill-current" : "text-gray-400"
          }`}
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </button>
    </div>
  );
}
