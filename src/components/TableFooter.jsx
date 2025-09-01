import React from "react";

const TableFooter = ({ meta }) => {
  if (!meta) return null;

  return (
    <div className="flex items-center justify-between mt-2 p-2 text-sm text-gray-600">
      <div>
        Showing {meta.from || 0} to {meta.to || 0} of {meta.total || 0} users
      </div>
      <div>
        Page {meta.current_page || 1} of {meta.last_page || 1}
      </div>
    </div>
  );
};

export default TableFooter;
