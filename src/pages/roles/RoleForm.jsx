import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { createRole, getRole, updateRole, getPermissions } from "../../services/rolesService";
import AdminLayout from "../../layouts/AdminLayout";
import PageTitle from "../../components/PageTitle";
import PageLoader from "../../components/PageLoader";

export default function RoleForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editing = Boolean(id);

  const [form, setForm] = useState({ 
    label: "", 
    description: "",
    
   });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const perms = await getPermissions();
        console.log(perms);
        setPermissions(perms);
      } catch (err) {
        Swal.fire("Error", err.message || "Failed to load permissions", "error");
      }
    })();
  }, []);

  useEffect(() => {
    if (!editing) return;
    (async () => {
      setLoading(true);
      try {
        const role = await getRole(id);
        console.log(role);
        // adapt Role object (API provided Role under data)
        setForm({ 
          label: role.label || "", 
          description: role.description || "",
          // extract permission IDs
          permissions: role.permissions ? role.permissions.map(p => p.id) : []
        });
      } catch (err) {
        Swal.fire("Error", err.message || "Failed to load Role", "error");
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
        await updateRole(id, form);
        Swal.fire("Updated", "Role updated successfully", "success");
      } else {
        console.log(form);
        await createRole(form);
        Swal.fire("Created", "Role created successfully", "success");
      }
      navigate("/Roles");
    } catch (err) {
      // Laravel validation errors usually in err.errors
      console.error(err);
      setErrors(err.errors || {});
      Swal.fire("Error", err.message || "Request failed", "error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <AdminLayout title="Role Form">
      <PageTitle
        title={editing ? "Edit Role" : "Create Role"}
        subtitle={editing ? "Edit Role for Module" : "Fill the form to create a new Role"}
      />
      {loading && <PageLoader />}
      {!loading && (
      <div className="py-2 max-w-3xl">
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm">Role Name (Ex. Super Admin)<span className="text-red-600">*</span></label>
            <input className="w-full border px-3 py-2 rounded-lg" value={form.label} onChange={(e)=>setForm({...form, label: e.target.value})} placeholder="Enter role name" />
            {errors.label && <p className="text-sm text-red-600">{errors.label[0]}</p>}
          </div>

          <div>
            <label className="block text-sm">Role Description</label>
            <textarea className="w-full border px-3 py-2 rounded-lg" rows="5" value={form.description} onChange={(e)=>setForm({...form, description: e.target.value})} placeholder="Enter role description" />
            {errors.description && <p className="text-sm text-red-600">{errors.description[0]}</p>}
          </div>
          <div>
            <label className="block text-sm">Permissions</label>
            {/* Print Permission Group By with checkbox */}
            <div className="overflow-y-auto border p-2 rounded-lg bg-white">
              {permissions.length === 0 && <p className="text-sm text-gray-500">No permissions found.</p>}
              {Object.entries(permissions).map(([module, perms]) => (
                <div key={module} className="mb-4">
                  <h5 className="font-semibold text-gray-700 mb-2 border-b border-gray-300 ">{module.charAt(0).toUpperCase() + module.slice(1)} 
                    {/* a check box for select all group permissions */}
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 mx-2"
                      checked={perms.every((perm) => form.permissions?.includes(perm.id))}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        let newPermissions = form.permissions ? [...form.permissions] : [];
                        if (checked) {
                          // add all permissions of this module
                          perms.forEach((perm) => {
                            if (!newPermissions.includes(perm.id)) {
                              newPermissions.push(perm.id);
                            }
                          });
                        } else {
                          // remove all permissions of this module
                          newPermissions = newPermissions.filter((p) => !perms.some((perm) => perm.id === p));
                        }
                        setForm({ ...form, permissions: newPermissions });
                      }}
                    /> 
                  </h5>
                  <div className="grid grid-cols-3 gap-2">
                    {perms.map((perm) => (
                      <label key={perm.id} className="inline-flex items-center">
                        <input
                          type="checkbox"
                          className="form-checkbox h-5 w-5"
                          value={perm.id}
                          checked={form.permissions?.includes(perm.id) || false}    
                          onChange={(e) => {
                            const checked = e.target.checked;
                            let newPermissions = form.permissions ? [...form.permissions] : [];
                            if (checked) {
                              newPermissions.push(perm.id);
                            } else {
                              newPermissions = newPermissions.filter((p) => p !== perm.id);
                            }
                            setForm({ ...form, permissions: newPermissions });
                          }}
                        />
                        <span className="ml-2">{perm.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              {errors.permissions && <p className="text-sm text-red-600">{errors.permissions[0]}</p>}
            </div>
            </div>
          <div className="flex gap-2">
            <button type="submit" disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded-lg">
              {loading ? "Saving..." : (editing ? "Update" : "Create")}
            </button>
            <button type="button" onClick={() => navigate(-1)} className="border px-4 py-2 rounded-lg">Cancel</button>
          </div>
        </form>
      </div>
      )}
    </AdminLayout>
  );
}
