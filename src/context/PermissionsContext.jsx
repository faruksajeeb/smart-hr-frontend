// context/PermissionsContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { getMe } from "../services/appService";
import Swal from "sweetalert2";

const PermissionsContext = createContext();

export const PermissionsProvider = ({ children }) => {
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const me = await getMe();
        setPermissions(me.permissions || []);
      } catch (err) {
        Swal.fire("Error", err.message || "Failed to load permission", "error");
      }
    })();
  }, []);

  const hasPermission = (perm) => permissions.includes(perm);

  return (
    <PermissionsContext.Provider value={{ permissions, hasPermission }}>
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissions = () => useContext(PermissionsContext);
