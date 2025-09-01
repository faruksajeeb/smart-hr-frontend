import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  getPermission,
  deletePermission,
} from "../../services/permissionsService";
import Swal from "sweetalert2";
import AdminLayout from "../../layouts/AdminLayout";
import PageTitle from "../../components/PageTitle";
import ActionButton from "../../components/ActionButton";
import PageLoader from "../../components/PageLoader";

export default function PermissionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [Permission, setPermission] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const u = await getPermission(id);
        setPermission(u);
      } catch (err) {
        Swal.fire("Error", err.message || "Failed to load", "error");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Delete Permission?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;

    try {
      await deletePermission(id);
      Swal.fire("Deleted", "Permission deleted", "success");
      navigate("/permissions");
    } catch (err) {
      Swal.fire("Error", err.message || "Delete failed", "error");
    }
  };

  // if (loading) return <div className="p-6">Loading...</div>;

  return (
    <AdminLayout title="Permission Details">
      <PageTitle
        title="Permission Details"
        subtitle="View Permission Details"
      />
    
      {loading && <PageLoader />}
     
      {!loading && !Permission && (
        <div className="p-6">Permission not found.</div>
      )}

      {!loading && Permission && (
        <>
          <div className="py-2 max-w-2xl">
            <div className="flex items-start justify-between">
              <h3 className="text-xl font-semibold">{Permission.name}</h3>
              <div className="flex gap-2">
                <ActionButton type="manage" to={`/permissions`}>
                  Manage
                </ActionButton>
                <ActionButton
                  type="edit"
                  to={`/permissions/${Permission.id}/edit`}
                >
                  Edit
                </ActionButton>
                <ActionButton type="delete" onClick={handleDelete}>
                  Delete
                </ActionButton>
              </div>
            </div>

            <div className="mt-4 bg-white border rounded p-4">
              <p>
                <strong>Module:</strong> {Permission.module}
              </p>
              <p>
                <strong>Name:</strong> {Permission.name}
              </p>
              <p>
                <strong>Label:</strong> {Permission.label}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Created: {new Date(Permission.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
