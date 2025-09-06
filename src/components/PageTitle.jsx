import React from "react";

const PageTitle = ({ title, subtitle, className }) => {
  return (
    <div className={`mb-4 ${className || ""}`}>
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
    </div>
  );
};

export default PageTitle;
