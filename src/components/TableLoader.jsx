import React from "react";

const TableLoader = ({ rows = 10, cols = 5 }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex} className="animate-pulse">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <td key={colIndex} className="py-2 border  border-gray-300">
              {colIndex === cols - 1 ? (
                // Last column → 3 small divs
                <div className="flex gap-2 text-right justify-end">
                  <div className="h-5 w-15 bg-gray-300 rounded"></div>
                  <div className="h-5 w-15 bg-gray-300 rounded"></div>
                  <div className="h-5 mr-2 w-15 bg-gray-300 rounded"></div>
                </div>
              ) : (
                // Normal cell
                <div className="h-4 m-2 w-24 bg-gray-300 rounded"></div>
              )}
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

export default TableLoader;
