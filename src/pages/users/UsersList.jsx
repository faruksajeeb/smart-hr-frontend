import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchUsers, deleteUser } from "../../services/usersService";
import Swal from "sweetalert2";
import AdminLayout from "../../layouts/AdminLayout";
import { Search } from "lucide-react";
import Pagination from "../../components/Pagination";
import TableLoader from "../../components/TableLoader";
import TableFooter from "../../components/TableFooter";
import ActionButton from "../../components/ActionButton";
import SearchBox from "../../components/SearchBox";
import PageTitle from "../../components/PageTitle";

import { usePermissions } from "../../context/PermissionsContext";

export default function UsersList() {
  const { hasPermission } = usePermissions();

  const [usersPayload, setUsersPayload] = useState({
    data: [],
    meta: {},
    links: {},
  });
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const perPage = 5;
  const dir = "desc"; // or 'asc'
  const [sort] = useState("id"); // or 'name', 'email', etc.

  // Fetch users whenever `page` or `q` changes
  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try {
        const data = await fetchUsers({
          page,
          per_page: perPage,
          search: q,
          sort,
          dir,
        });
        setUsersPayload(data);
      } catch (err) {
        console.error(err);
        Swal.fire("Error", err.message || "Failed to load users", "error");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [page, q]);

  // Handle search
  const handleSearch = () => {
    setPage(1); // reset to first page on new search
  };

  // Handle delete
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete user?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteUser(id);
      Swal.fire("Deleted", "User deleted successfully", "success");

      // Remove deleted user from local state
      setUsersPayload((prev) => ({
        ...prev,
        data: prev.data.filter((u) => u.id !== id),
        // optionally adjust meta.total
        meta: {
          ...prev.meta,
          total: prev.meta.total - 1,
          to: prev.meta.to - 1,
        },
      }));

      // Handle last item on page
      if (usersPayload.data.length === 1 && page > 1) {
        setPage(page - 1);
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.message || "Delete failed", "error");
    }
  };

  return (
    <AdminLayout title="Users">
      {/* Page Title */}
      <PageTitle
        title="Users"
        subtitle="Manage all system users and their roles"
      />

      <div className="py-2">
        <div className="flex mb-1 text-nowrap">
          <SearchBox
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onSearch={handleSearch}
            placeholder="Search by name or email"
          />
          <ActionButton type="refresh" onClick={() => setPage(1)}>
            Refresh
          </ActionButton>
          {hasPermission("add-user") && (
            <ActionButton type="add" to={`/users/create`}>
              New User
            </ActionButton>
          )}
          {hasPermission("import-user") && (
            <ActionButton type="import" to={`/users/import`}>
              Import
            </ActionButton>
          )}
          {hasPermission("export-user") && (
            <ActionButton type="export" to={`/users/export`}>
              Export
            </ActionButton>
          )}
        </div>
        {/* Users table */}
        <div className="bg-white border rounded-lg overflow-x-auto">
          <table className="min-w-full text-sm border border-gray-300 border-collapse rounded-lg overflow-hidden shadow-sm">
            <thead className="bg-gray-200 text-gray-700 font-semibold">
              <tr>
                <th className="p-3 text-center border border-gray-300">SL</th>
                <th className="p-3 text-left border border-gray-300">Name</th>
                <th className="p-3 text-left border border-gray-300">Email</th>
                <th className="p-3 text-left border border-gray-300">Roles</th>
                <th className="p-3 text-left border border-gray-300">
                  Pemissions
                </th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableLoader rows={10} cols={6} />
              ) : usersPayload.data.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-6 text-center">
                    No users found.
                  </td>
                </tr>
              ) : (
                usersPayload.data.map((u, index) => (
                  <tr
                    key={u.id}
                    className="odd:bg-white even:bg-gray-50 transition hover:bg-gray-100 hover:text-gray-900"
                  >
                    <td className="p-1 border  border-gray-300 text-center">
                      {index + 1}
                    </td>
                    <td className="p-1 border  border-gray-300">{u.name}</td>
                    <td className="p-1 border  border-gray-300">{u.email}</td>
                    <td className="p-1 border  border-gray-300">
                      {u.roles.map((p) => (
                        <span
                          key={p.id}
                          className="m-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs border-1 border-blue-950"
                        >
                          {p.label}
                        </span>
                      ))}
                    </td>
                    <td className="p-1 border  border-gray-300">
                      {/* {u.permissions.map((p) => (
                      <span
                        key={p.id}
                        className="m-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                      >
                        {p.label}
                      </span>
                    ))} */}
                    </td>
                    <td className="p-1 border border-gray-300 text-right space-x-2">
                      {hasPermission("view-user") && (
                        <ActionButton type="view" to={`/users/${u.id}`}>
                          View
                        </ActionButton>
                      )}
                      {hasPermission("edit-user") && (
                        <ActionButton type="edit" to={`/users/${u.id}/edit`}>
                          Edit
                        </ActionButton>
                      )}
                      {hasPermission("delete-user") && (
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
          {/* Table footer */}
          <TableFooter meta={usersPayload.meta} />
        </div>

        {/* Pager */}
        <Pagination
          page={page}
          setPage={setPage}
          lastPage={usersPayload.meta?.last_page || 1}
        />
      </div>
    </AdminLayout>
  );
}
