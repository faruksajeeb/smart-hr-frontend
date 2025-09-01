// components/PageLoader.jsx
export default function PageLoader() {
  return (
    <div className="p-6 animate-pulse space-y-4">
      {/* Title */}
      <div className="h-6 bg-gray-300 rounded w-1/3"></div>

      {/* Paragraph lines */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-300 rounded w-full"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        <div className="h-4 bg-gray-300 rounded w-4/6"></div>
      </div>

      {/* Button */}
      <div className="h-10 bg-gray-300 rounded w-32"></div>
    </div>
  );
}
