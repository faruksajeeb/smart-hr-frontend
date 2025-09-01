import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getRole, deleteRole } from "../../services/rolesService";
import Swal from "sweetalert2";
import AdminLayout from "../../layouts/AdminLayout";
import PageTitle from "../../components/PageTitle";
import ActionButton from "../../components/ActionButton";
import PageLoader from "../../components/PageLoader";

import { usePermissions } from "../../context/PermissionsContext";

export default function RoleDetails() {
  const { hasPermission } = usePermissions();

  const { id } = useParams();
  const navigate = useNavigate();
  const [Role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const u = await getRole(id);
        setRole(u);
      } catch (err) {
        Swal.fire("Error", err.message || "Failed to load", "error");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Delete Role?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteRole(id);
      Swal.fire("Deleted", "Role deleted", "success");
      navigate("/Roles");
    } catch (err) {
      Swal.fire("Error", err.message || "Delete failed", "error");
    }
  };

  // if (loading) return <div className="p-6">Loading...</div>;

  return (
    <AdminLayout title="Role Details">
      <PageTitle title="Role Details" subtitle="View Role Details" />

      {loading && <PageLoader />}

      {!loading && !Role && <div className="p-6">Role not found.</div>}

      {!loading && Role && (
        <>
          <div className="py-2 max-w-2xl">
            <div className="flex items-start justify-between">
              <h3 className="text-xl font-semibold">{Role.name}</h3>
              <div className="flex gap-2">
                {hasPermission("view-role") && (
                  <ActionButton type="manage" to={`/Roles`}>
                    Manage
                  </ActionButton>
                )}
                {hasPermission("edit-role") && (
                  <ActionButton type="edit" to={`/Roles/${Role.id}/edit`}>
                    Edit
                  </ActionButton>
                )}
                {hasPermission("delete-role") && (
                  <ActionButton type="delete" onClick={handleDelete}>
                    Delete
                  </ActionButton>
                )}
              </div>
            </div>

            <div className="mt-4 bg-white border rounded p-4">
              <p>
                <strong>Name:</strong> {Role.name}
              </p>
              <p>
                <strong>Label:</strong> {Role.label}
              </p>
              <p>
                <strong>Permissions:</strong>
                <br />
                {Role.permissions.map((p) => (
                  <span
                    key={p.id}
                    className="m-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                  >
                    {p.label}
                  </span>
                ))}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Created: {new Date(Role.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
