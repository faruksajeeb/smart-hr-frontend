import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getUser, deleteUser } from "../../services/usersService";
import Swal from "sweetalert2";
import AdminLayout from "../../layouts/AdminLayout";
import PageTitle from "../../components/PageTitle";
import ActionButton from "../../components/ActionButton";

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const u = await getUser(id);
        setUser(u);
      } catch (err) {
        Swal.fire("Error", err.message || "Failed to load", "error");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Delete user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteUser(id);
      Swal.fire("Deleted", "User deleted", "success");
      navigate("/users");
    } catch (err) {
      Swal.fire("Error", err.message || "Delete failed", "error");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!user) return <div className="p-6">User not found.</div>;

  return (
    <AdminLayout title="User Details">
      <PageTitle
        title="User Details"
        subtitle="View User Details"
      />
      <div className="py-2 max-w-2xl">
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-semibold">{user.name}</h3>
          <div className="flex gap-2">
            <ActionButton type="manage" to={`/users`} >
                Manage
            </ActionButton>
            <ActionButton type="edit" to={`/users/${user.id}/edit`} >
                Edit
            </ActionButton>
            <ActionButton type="delete" onClick={handleDelete}>
                Delete
            </ActionButton>
          </div>
        </div>

        <div className="mt-4 bg-white border rounded p-4">
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Created: {new Date(user.created_at).toLocaleString()}
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
