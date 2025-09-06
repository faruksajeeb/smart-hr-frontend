import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { debounce } from "lodash"; // or write your own small debounce

import { fetchRoles, deleteRole } from "../../services/rolesService";
import Swal from "sweetalert2";
import AdminLayout from "../../layouts/AdminLayout";

import Pagination from "../../components/Pagination";
import TableLoader from "../../components/TableLoader";
import SearchBox from "../../components/SearchBox";
import ActionButton from "../../components/ActionButton";
import PageTitle from "../../components/PageTitle";

import { usePermissions } from "../../context/PermissionsContext";
import TableFooter from "../../components/TableFooter";

export default function RolesList() {
  const { hasPermission } = usePermissions();

  const [RolesPayload, setRolesPayload] = useState({
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

  // Fetch Roles whenever `page` or `q` changes
  useEffect(() => {
    const loadRoles = async () => {
      setLoading(true);
      try {
        const data = await fetchRoles({
          page,
          per_page: perPage,
          search: q,
          sort,
          dir,
        });
        console.log(data);
        setRolesPayload(data);
      } catch (err) {
        console.error(err);
        Swal.fire("Error", err.message || "Failed to load Roles", "error");
      } finally {
        setLoading(false);
      }
    };

    loadRoles();
  }, [page, debouncedQ]); // use debouncedQ here

  // Handle search
  const handleSearch = () => {
    setPage(1); // reset to first page on new search
  };

  // Handle delete
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Role?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteRole(id);
      Swal.fire("Deleted", "Role deleted successfully", "success");

      // if last Role on page deleted, move back a page if possible
      if (RolesPayload.data.length === 1 && page > 1) {
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
    <AdminLayout title="Roles">
      {/* Page Title */}
      <PageTitle
        title="Roles"
        subtitle="Manage all system Roles and their roles"
      />
      <div className="py-6">
        <div className="flex mb-1 text-nowrap">
          <SearchBox
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onSearch={handleSearch}
            placeholder="Search by Role name or module"
          />

          <ActionButton type="refresh" onClick={() => setPage(1)}>
            Refresh
          </ActionButton>
          {hasPermission("add-role") && (
            <ActionButton type="add" to={`/Roles/create`}>
              New Role
            </ActionButton>
          )}
          {hasPermission("import-role") && (
            <ActionButton type="import" to={`/Roles/import`}>
              Import
            </ActionButton>
          )}
          {hasPermission("export-role") && (
            <ActionButton type="export" to={`/Roles/export`}>
              Export
            </ActionButton>
          )}
        </div>

        {/* Roles table */}
        <div className="bg-white border rounded-lg overflow-x-auto">
          <table className="min-w-full text-sm border border-gray-300 border-collapse rounded-lg overflow-hidden shadow-sm">
            <thead className="bg-gray-200 text-gray-700 font-semibold">
              <tr>
                <th className="p-3 text-center border border-gray-300 ">ID</th>
                <th className="p-3 text-left border border-gray-300">Name</th>
                <th className="p-3 text-left border border-gray-300">Label</th>
                <th className="p-3 text-left border border-gray-300">
                  permissions
                </th>
                {/* <th className="p-3 text-left border border-gray-300">Guard Name</th> */}
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableLoader rows={10} cols={6} />
              ) : RolesPayload.data.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center">
                    No Roles found.
                  </td>
                </tr>
              ) : (
                RolesPayload.data.map((u) => (
                  <tr
                    key={u.id}
                    className="odd:bg-white even:bg-gray-50 transition hover:bg-gray-100 hover:text-gray-900"
                  >
                    <td className="p-1 border  border-gray-300 text-center">
                      {u.id}
                    </td>
                    <td className="p-1 border  border-gray-300">{u.name}</td>
                    <td className="p-1 border  border-gray-300">{u.label}</td>
                    <td className="p-1 border  border-gray-300">
                      {u.permissions.map((p) => (
                        <span
                          key={p.id}
                          className="inline-block  m-1 px-2 py-1 bg-purple-100 text-purple-900 rounded text-xs border-1 border-gray-800"
                        >
                          {p.label}
                        </span>
                      ))}
                    </td>
                    {/* <td className="p-1 border  border-gray-300">{u.guard_name}</td> */}
                    <td className="p-1 border border-gray-300 text-right space-x-2 text-nowrap">
                      {hasPermission("view-role") && (
                        <ActionButton type="view" to={`/Roles/${u.id}`}>
                          View
                        </ActionButton>
                      )}
                      {hasPermission("edit-role") && (
                        <ActionButton type="edit" to={`/Roles/${u.id}/edit`}>
                          Edit
                        </ActionButton>
                      )}
                      {hasPermission("delete-role") && (
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
          <TableFooter meta={RolesPayload.meta} />
        </div>

        {/* Pager */}
        <Pagination
          page={page}
          setPage={setPage}
          lastPage={RolesPayload.meta?.last_page || 1}
        />
      </div>
    </AdminLayout>
  );
}
