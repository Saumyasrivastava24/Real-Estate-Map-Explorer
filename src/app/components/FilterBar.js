export default function FilterBar({ onSearch }) {
  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-md">
      <input
        type="text"
        placeholder="Search by city or address..."
        className="p-2 border rounded w-full"
        onChange={(e) => onSearch(e.target.value)}
      />
      <select className="p-2 border rounded">
        <option value="">All Prices</option>
        <option value="low">Below $500K</option>
        <option value="mid">$500K - $1M</option>
        <option value="high">Above $1M</option>
      </select>
      <button className="bg-blue-600 text-white px-4 py-2 rounded">
        Search
      </button>
    </div>
  );
}
