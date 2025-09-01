import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { debounce } from "lodash"; // or write your own small debounce

import {
  fetchPermissions,
  deletePermission,
} from "../../services/PermissionsService";
import Swal from "sweetalert2";
import AdminLayout from "../../layouts/AdminLayout";

import Pagination from "../../components/Pagination";
import TableLoader from "../../components/TableLoader";
import SearchBox from "../../components/SearchBox";
import ActionButton from "../../components/ActionButton";
import PageTitle from "../../components/PageTitle";

import { usePermissions } from "../../context/PermissionsContext";

export default function PermissionsList() {
  const { hasPermission } = usePermissions();

  const [PermissionsPayload, setPermissionsPayload] = useState({
    data: [],
    meta: {},
    links: {},
  });
  const [page, setPage] = useState(1);

  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState(q);

  const [loading, setLoading] = useState(false);
  const perPage = 10;
  const dir = "desc"; // or 'asc'
  const [sort] = useState("id"); // or 'name', 'email', etc.

  // Debounce search value
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQ(q);
    }, 500); // wait 500ms after user stops typing

    return () => {
      clearTimeout(handler);
    };
  }, [q]);

  // Fetch Permissions whenever `page` or `q` changes
  useEffect(() => {
    const loadPermissions = async () => {
      setLoading(true);
      try {
        const data = await fetchPermissions({
          page,
          per_page: perPage,
          search: q,
          sort,
          dir,
        });
        setPermissionsPayload(data);
      } catch (err) {
        console.error(err);
        Swal.fire(
          "Error",
          err.message || "Failed to load Permissions",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    loadPermissions();
  }, [page, debouncedQ]); // use debouncedQ here

  // Handle search
  const handleSearch = () => {
    setPage(1); // reset to first page on new search
  };

  // Handle delete
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Permission?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;

    try {
      await deletePermission(id);
      Swal.fire("Deleted", "Permission deleted successfully", "success");

      // if last Permission on page deleted, move back a page if possible
      if (PermissionsPayload.data.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        // refresh current page
        setPage(page);
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.message || "Delete failed", "error");
    }
  };

  return (
    <AdminLayout title="Permissions">
      {/* Page Title */}
      <PageTitle
        title="Permissions"
        subtitle="Manage all system permissions and their roles"
      />
      <div className="py-6">
        <div className="flex mb-1 text-nowrap">
          <SearchBox
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onSearch={handleSearch}
            placeholder="Search by permission name or module"
          />

          <ActionButton type="refresh" onClick={() => setPage(1)}>
            Refresh
          </ActionButton>
          {hasPermission("add-permission") && (
            <ActionButton type="add" to={`/permissions/create`}>
              New Permission
            </ActionButton>
          )}
          {hasPermission("import-permission") && (
            <ActionButton type="import" to={`/permissions/import`}>
              Import
            </ActionButton>
          )}
          {hasPermission("export-permission") && (
            <ActionButton type="export" to={`/permissions/export`}>
              Export
            </ActionButton>
          )}
        </div>

        {/* Permissions table */}
        <div className="bg-white border rounded-lg overflow-x-auto">
          <table className="min-w-full text-sm border border-gray-300 border-collapse rounded-lg overflow-hidden shadow-sm">
            <thead className="bg-gray-200 text-gray-700 font-semibold">
              <tr>
                <th className="p-3 text-center border border-gray-300 ">ID</th>
                <th className="p-3 text-left border border-gray-300">Module</th>
                <th className="p-3 text-left border border-gray-300">Name</th>
                <th className="p-3 text-left border border-gray-300">Label</th>
                <th className="p-3 text-left border border-gray-300">
                  Description
                </th>
                {/* <th className="p-3 text-left border border-gray-300">Guard Name</th> */}
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableLoader rows={10} cols={6} />
              ) : PermissionsPayload.data.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center">
                    No permissions found.
                  </td>
                </tr>
              ) : (
                PermissionsPayload.data.map((u) => (
                  <tr
                    key={u.id}
                    className="odd:bg-white even:bg-gray-50 transition hover:bg-gray-100 hover:text-gray-900"
                  >
                    <td className="p-1 border  border-gray-300 text-center">
                      {u.id}
                    </td>
                    <td className="p-1 border  border-gray-300">{u.module}</td>
                    <td className="p-1 border  border-gray-300">{u.name}</td>
                    <td className="p-1 border  border-gray-300">{u.label}</td>
                    <td className="p-1 border  border-gray-300">
                      {u.description}
                    </td>
                    {/* <td className="p-1 border  border-gray-300">{u.guard_name}</td> */}
                    <td className="p-1 border border-gray-300 text-right space-x-2">
                      {hasPermission("view-permission") && (
                        <ActionButton type="view" to={`/permissions/${u.id}`}>
                          View
                        </ActionButton>
                      )}
                      {hasPermission("edit-permission") && (
                        <ActionButton
                          type="edit"
                          to={`/permissions/${u.id}/edit`}
                        >
                          Edit
                        </ActionButton>
                      )}
                      {hasPermission("delete-permission") && (
                        <ActionButton
                          type="delete"
                          onClick={() => handleDelete(u.id)}
                        >
                          Delete
                        </ActionButton>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pager */}
        <Pagination
          page={page}
          setPage={setPage}
          lastPage={PermissionsPayload.meta?.last_page || 1}
        />
      </div>
    </AdminLayout>
  );
}
