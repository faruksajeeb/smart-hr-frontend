import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { createUser, getUser, updateUser, getActiveRoles } from "../../services/usersService";
import AdminLayout from "../../layouts/AdminLayout";
import PageTitle from "../../components/PageTitle";
import Select from "react-select";
import PageLoader from "../../components/PageLoader";


export default function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editing = Boolean(id);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    selectedRoles: [],
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const roles = await getActiveRoles();
        console.log(roles.data);
        setRoles(roles.data);
      } catch (err) {
        Swal.fire("Error", err.message || "Failed to load roles", "error");
      }
    })();
  }, []);

  useEffect(() => {

    if (!editing) return;
    (async () => {
      setLoading(true);
      try {
        const user = await getUser(id);
        // adapt user object (API provided user under data)
        setForm({
          name: user.name || "",
          email: user.email || "",
          password: "",
          selectedRoles: user.roles.map(r => r.id) || [],
        });
      } catch (err) {
        Swal.fire("Error", err.message || "Failed to load user", "error");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, editing]);

  const submit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      if (editing) {
        await updateUser(id, form);
        Swal.fire("Updated", "User updated successfully", "success");
      } else {
        await createUser(form);
        Swal.fire("Created", "User created successfully", "success");
      }
      navigate("/users");
    } catch (err) {
      // Laravel validation errors usually in err.errors
      console.error(err);
      setErrors(err.errors || {});
      Swal.fire("Error", err.message || "Request failed", "error");
    } finally {
      setLoading(false);
    }
  };



const roleOptions = roles.map((r) => ({
  value: r.id,
  label: r.label,
}));

  return (
    <AdminLayout title="User Form">
      <PageTitle
        title={editing ? "Edit User" : "Create User"}
        subtitle={editing ? "Edit User" : "Create User"}
      />
          {loading && <PageLoader />}
            {!loading && (
      <div className="py-2 max-w-2xl">
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm">Full name <span className="text-red-600">*</span></label>
            <input
              className="w-full border px-3 py-2 rounded-lg"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-sm">Email <span className="text-red-600">*</span></label>
            <input
              className="w-full border px-3 py-2 rounded-lg"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-sm">
              Password  <span className="text-red-600">*</span> {" "}
              {editing && (
                <span className="text-xs text-gray-500">
                  (leave blank to keep current)
                </span>
              )}
            </label>
            <input
              type="password"
              className="w-full border px-3 py-2 rounded-lg"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-sm">Role  <span className="text-red-600">*</span></label>
           <Select
              isMulti                    // enable multiple selection
              options={roleOptions}       // options array
              value={roleOptions.filter(opt => form.selectedRoles?.includes(opt.value))} // selected roles
              onChange={(selected) => {
                setForm({
                  ...form,
                  selectedRoles: selected ? selected.map(opt => opt.value) : []
                });
              }}

              placeholder="Select Roles..."
            />

          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              {loading ? "Saving..." : editing ? "Update" : "Create"}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="border px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
            )}
    </AdminLayout>
  );
}
