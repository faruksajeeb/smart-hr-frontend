// components/Pagination.jsx
import React from "react";

const Pagination = ({ page, setPage, lastPage }) => {
  return (
    <div className="mt-1 flex items-center gap-2 flex-wrap">
      {/* Prev Button */}
      <button
        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        disabled={page === 1}
        className="border px-3 py-1 rounded disabled:opacity-50"
      >
        Prev
      </button>

      {/* Page numbers */}
      {Array.from({ length: Math.min(10, lastPage || 1) }, (_, i) => {
        const pageNumber = i + 1;
        return (
          <button
            key={pageNumber}
            onClick={() => setPage(pageNumber)}
            className={`border px-3 py-1 rounded ${
              pageNumber === page ? "bg-green-600 text-white" : ""
            }`}
          >
            {pageNumber}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        onClick={() => setPage((prev) => Math.min(prev + 1, lastPage || 1))}
        disabled={page === lastPage}
        className="border px-3 py-1 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
