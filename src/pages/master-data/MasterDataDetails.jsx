import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  getMasterData,
  deleteMasterData,
} from "../../services/masterDataService";

import Swal from "sweetalert2";
import AdminLayout from "../../layouts/AdminLayout";
import PageTitle from "../../components/PageTitle";
import ActionButton from "../../components/ActionButton";
import PageLoader from "../../components/PageLoader";

import { usePermissions } from "../../context/PermissionsContext";

export default function MasterDataDetails() {
  const { hasPermission } = usePermissions();

  const { id } = useParams();
  const navigate = useNavigate();
  const [MasterData, setMasterData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const u = await getMasterData(id);
        setMasterData(u);
      } catch (err) {
        Swal.fire("Error", err.message || "Failed to load", "error");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Delete MasterData?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteMasterData(id);
      Swal.fire("Deleted", "MasterData deleted", "success");
      navigate("/master-data");
    } catch (err) {
      Swal.fire("Error", err.message || "Delete failed", "error");
    }
  };

  // if (loading) return <div className="p-6">Loading...</div>;

  return (
    <AdminLayout title="Master Data Details">
      <PageTitle
        title="Master Data Details"
        subtitle="View Master Data Details"
      />

      {loading && <PageLoader />}

      {!loading && !MasterData && (
        <div className="p-6">MasterData not found.</div>
      )}

      {!loading && MasterData && (
        <>
          <div className="py-2 max-w-2xl">
            <div className="flex items-start justify-between">
              <h3 className="text-xl font-semibold">{MasterData.name}</h3>
              <div className="flex gap-2">
                {hasPermission("view-master-data") && (
                  <ActionButton type="manage" to={`/master-data`}>
                    Manage
                  </ActionButton>
                )}
                {hasPermission("edit-master-data") && (
                  <ActionButton
                    type="edit"
                    to={`/master-data/${MasterData.id}/edit`}
                  >
                    Edit
                  </ActionButton>
                )}
                {hasPermission("delete-master-data") && (
                  <ActionButton type="delete" onClick={handleDelete}>
                    Delete
                  </ActionButton>
                )}
              </div>
            </div>

            <div className="mt-4 bg-white border rounded p-4">
              <p className="flex items-center justify-between">
              <span>
                <strong>Type:</strong> {MasterData.type}
              </span>
              {MasterData.status ? (
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 border border-green-900">
                  Active
                </span>
              ) : (
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700 border border-red-900">
                  Inactive
                </span>
              )}
            </p>

              <p>
                <strong>Name:</strong> {MasterData.name}
              </p>
              <p>
                <strong>Code:</strong> {MasterData.code}
              </p>
              <p>
                <strong>Parent:</strong> {MasterData.parent?.name}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Created: {new Date(MasterData.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
