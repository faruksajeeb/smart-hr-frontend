import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { createPermission, getPermission, updatePermission } from "../../services/PermissionsService";
import AdminLayout from "../../layouts/AdminLayout";
import PageTitle from "../../components/PageTitle";
import PageLoader from "../../components/PageLoader";

export default function PermissionForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editing = Boolean(id);

  const [form, setForm] = useState({ module: "", label: "", description: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!editing) return;
    (async () => {
      setLoading(true);
      try {
        const Permission = await getPermission(id);
        // adapt Permission object (API provided Permission under data)
        setForm({ module: Permission.module || "", label: Permission.label || "", description: Permission.description || "" });
      } catch (err) {
        Swal.fire("Error", err.message || "Failed to load Permission", "error");
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
        await updatePermission(id, form);
        Swal.fire("Updated", "Permission updated successfully", "success");
      } else {
        console.log(form);
        await createPermission(form);
        Swal.fire("Created", "Permission created successfully", "success");
      }
      navigate("/Permissions");
    } catch (err) {
      // Laravel validation errors usually in err.errors
      console.error(err);
      setErrors(err.errors || {});
      Swal.fire("Error", err.message || "Request failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const modules = [
    {val: "user", label: "User Management" },
    {val: "role", label: "Role Management" },
    {val: "permission", label: "Permission Management" },
    {val: "business_settings", label: "Business Settings Management" },
    {val: "master_data", label: "Master Data Management" },
    {val: "designation", label: "Designation Management" },
    {val: "employee", label: "Employee Management" },
    {val: "attendance", label: "Attendance Management" },
    {val: "leave", label: "Leave Management" },
    {val: "payroll", label: "Payroll Management" },
    {val: "report", label: "Report Management" },
  ];

  return (
    <AdminLayout title="Permission Form">
      <PageTitle
        title={editing ? "Edit Permission" : "Create Permission"}
        subtitle={editing ? "Edit Permission for Module" : "Fill in the details below to create a new permission"}
      />
      {loading && <PageLoader />}
      {!loading && (
      <div className="py-2 max-w-2xl">
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm">Module Name <span className="text-red-600">*</span></label>
            <select className="w-full border px-3 py-2 rounded-lg" value={form.module} 
            onChange={(e)=>setForm({...form, module: e.target.value})}
            >
              <option value="">Select Module</option>
              {modules.map((module) => (
                <option key={module.val} value={module.val}>
                  {module.label}
                </option>
              ))}
            </select>
            {errors.module && <p className="text-sm text-red-600">{errors.module[0]}</p>}
          </div>

          <div>
            <label className="block text-sm">Permission Label (Ex. Create User)<span className="text-red-600">*</span></label>
            <input className="w-full border px-3 py-2 rounded-lg" value={form.label} onChange={(e)=>setForm({...form, label: e.target.value})} />
            {errors.label && <p className="text-sm text-red-600">{errors.label[0]}</p>}
          </div>

          <div>
            <label className="block text-sm">Permission Description</label>
            <textarea className="w-full border px-3 py-2 rounded-lg" rows="5" value={form.description} onChange={(e)=>setForm({...form, description: e.target.value})} />
            {errors.description && <p className="text-sm text-red-600">{errors.description[0]}</p>}
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
