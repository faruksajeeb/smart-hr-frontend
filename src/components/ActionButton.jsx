import React from "react";
import { Link } from "react-router-dom";
import { Plus, Edit, View, Trash2, Table, Upload, DownloadIcon, RefreshCcw, Unlock, LockIcon  } from "lucide-react";

const ActionButton = ({ type, to, href, onClick, icon: Icon, children }) => {
  const colors = {
    manage: "bg-blue-600 hover:bg-blue-700 text-white",
    view: "bg-blue-500 hover:bg-blue-600 text-white",
    add: "bg-blue-500 hover:bg-blue-600 text-white ml-auto",
    edit: "bg-amber-500 hover:bg-amber-600 text-white",
    delete: "bg-red-400 hover:bg-red-700 text-white",
    refresh: "bg-blue-400 hover:bg-blue-700 text-white",
    import: "bg-yellow-600 hover:bg-yellow-700 text-white",
    export: "bg-green-600 hover:bg-green-700 text-white",
    activate: "bg-green-400 hover:bg-green-600 text-white px-2 py-1 rounded",
    deactivate: "bg-red-400 hover:bg-red-600 text-white px-2 py-1 rounded",
  };

  const icons = {
    manage: Table,
    add: Plus,
    edit: Edit,
    view: View,
    delete: Trash2,
    import: Upload,
    export: DownloadIcon,
    refresh: RefreshCcw,
    activate: Unlock,
    deactivate: LockIcon
  };
  Icon = Icon || icons[type];

  const baseClass =
    "inline-flex items-center px-3 py-2 rounded-sm mx-1 transition border-none  no-underline hover:no-underline text-sm";

  if (to) {
    return (
      <Link to={to} className={`${baseClass} ${colors[type]}`}>
        {Icon && <Icon className="w-4 h-4" />}
        {children}
      </Link>
    );
  }


  return (
    <button onClick={onClick} className={`${baseClass} ${colors[type]}`}>
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
};

export default ActionButton;
