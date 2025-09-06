import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  createMasterData,
  getMasterData,
  getMasterDataTypes,
  getActiveMasterData,
  updateMasterData,
} from "../../services/masterDataService";
import AdminLayout from "../../layouts/AdminLayout";
import PageTitle from "../../components/PageTitle";
import PageLoader from "../../components/PageLoader";

export default function MasterDataForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editing = Boolean(id);

  const [form, setForm] = useState({
    type: "",
    name: "",
    code: "",
    parent_id: "",
    description: "",
    status: 1,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [masterDataTypes, setMasterDataTypes] = useState([]);
  const [parents, setParents] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const master_data_types = await getMasterDataTypes();
        setMasterDataTypes(master_data_types.data);
      } catch (err) {
        Swal.fire("Error", err.message || "Failed to load roles", "error");
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const parents = await getActiveMasterData();
        console.log(parents);
        setParents(parents.data);
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
        const MasterData = await getMasterData(id);
        console.log(MasterData);
        // adapt MasterData object (API provided MasterData under data)
        setForm({
          type: MasterData.type || "",
          name: MasterData.name || "",
          code: MasterData.code || "",
          parent_id: MasterData.parent_id || "",
          description: MasterData.description || "",
          status: MasterData.status || "",
        });
      } catch (err) {
        Swal.fire("Error", err.message || "Failed to load MasterData", "error");
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
        await updateMasterData(id, form);
        Swal.fire("Updated", "MasterData updated successfully", "success");
      } else {
        console.log(form);
        await createMasterData(form);
        Swal.fire("Created", "MasterData created successfully", "success");
      }
      navigate("/master-data");
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
    <AdminLayout title="Master Data Form">
      <PageTitle
        title={editing ? "Edit Master Data" : "Create Master Data"}
        subtitle={
          editing
            ? "Edit MasterData for Module"
            : "Fill in the details below to create a new MasterData"
        }
      />
      {loading && <PageLoader />}
      {!loading && (
        <div className="py-2 max-w-2xl">
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm">
                Type <span className="text-red-600">*</span>
              </label>
              <select
                className="w-full border px-3 py-2 rounded-lg"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="">Select Types</option>
                {masterDataTypes.map((val) => (
                  <option key={val} value={val}>
                    {val}
                  </option>
                ))}
              </select>
              {errors.type && (
                <p className="text-sm text-red-600">{errors.type[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm">
                Parent <span className="text-red-600">*</span>
              </label>
              <select
                className="w-full border px-3 py-2 rounded-lg"
                value={form.parent_id}
                onChange={(e) =>
                  setForm({ ...form, parent_id: e.target.value })
                }
              >
                <option value="">Select Parent</option>
                {parents.map((val) => (
                  <option key={val} value={val.id}>
                    {val.name}
                  </option>
                ))}
              </select>
              {errors.parent_id && (
                <p className="text-sm text-red-600">{errors.parent_id[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm">
                MasterData Label (Ex. Executive Officer/ Dhaka)
                <span className="text-red-600">*</span>
              </label>
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
              <label className="block text-sm">
                Code (Ex. BSTL)<span className="text-red-600">*</span>
              </label>
              <input
                className="w-full border px-3 py-2 rounded-lg"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
              />
              {errors.code && (
                <p className="text-sm text-red-600">{errors.code[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm">MasterData Description</label>
              <textarea
                className="w-full border px-3 py-2 rounded-lg"
                rows="3"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm">
                Status <span className="text-red-600">*</span>
              </label>
              <select
                className="w-full border px-3 py-2 rounded-lg"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="">Select Status</option>
                <option key={1} value="1">
                  Active
                </option>
                <option key={2} value="0">
                  Inactive
                </option>
              </select>
              {errors.status && (
                <p className="text-sm text-red-600">{errors.status[0]}</p>
              )}
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
