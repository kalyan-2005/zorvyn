export default function Header() {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-semibold">Dashboard</h2>

      <div className="flex items-center gap-4">
        <button className="bg-indigo-500 px-4 py-2 rounded-lg hover:bg-indigo-600 transition">
          + Add Record
        </button>
      </div>
    </div>
  );
}