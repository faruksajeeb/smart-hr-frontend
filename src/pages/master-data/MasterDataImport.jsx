import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import AdminLayout from "../../layouts/AdminLayout";
import { Download, Upload } from "lucide-react"; // icons
import { masterDataImport } from "../../services/masterDataService";
import ActionButton from "../../components/ActionButton";
import { usePermissions } from "../../context/PermissionsContext";

export default function MasterDataImport() {
  const { hasPermission } = usePermissions();
  const [errors, setErrors] = useState({});
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImport = async () => {
    setErrors({});
    setLoading(true);
    if (!file) {
      Swal.fire("Error", "Please select a file", "error");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await masterDataImport(formData);
      Swal.fire("Success", "Master Data imported successfully", "success");
    } catch (err) {
      // Laravel validation errors usually in err.errors
      console.error(err);
      setErrors(err.errors || {});
      Swal.fire("Error", err.message || "Request failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSampleDownload = () => {
    window.location.href = "/sample/master_data.xlsx"; // put file in /public/sample/
  };

  return (
    <AdminLayout title="Import Master Data">
      <div className="max-w-2xl mx-auto mt-8 p-6 border rounded-2xl bg-white shadow-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Import Master Data
        </h2>
        {}

        {/* File Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Upload Excel/CSV File
          </label>
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileChange}
            className="block h-10 w-full text-sm bg text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {file && (
            <p className="mt-2 text-sm text-gray-600">
              Selected file: <strong>{file.name}</strong>
            </p>
          )}

          {/* Show file errors */}
          {errors.file && (
            <ul className="text-red-500 text-sm mt-1">
              {errors.file.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          )}
        </div>
        {/* Show global errors (if any) */}
        {Array.isArray(errors) && errors.length > 0 && (
          <div className="mt-4 p-3 border border-red-300 bg-red-50 rounded">
            <h5 className="text-red-700 font-semibold mb-2">Import Errors</h5>
            <ul className="space-y-2 text-sm text-red-600">
              {errors.map((err, index) => (
                <li key={index} className="border-b pb-1">
                  <strong>Row {err.row}</strong> - <em>{err.attribute}</em>
                  <ul className="ml-4 list-disc">
                    {err.errors.map((msg, i) => (
                      <li key={i}>{msg}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleImport}
            className="flex justify-between gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow transition"
          >
            <Upload className="w-4 h-4" /> {loading ? "Importing..." : "Import"}
          </button>

          <button
            onClick={handleSampleDownload}
            className="flex justify-between gap-2 px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg border transition"
          >
            <Download className="w-4 h-4" /> Download Sample
          </button>
          {hasPermission("view-master-data") && (
            <ActionButton type="manage" to={`/master-data`}>
              Manage Data
            </ActionButton>
          )}
        </div>
      </div>

      <div className="mt-4 p-4 border border-gray-200 bg-gray-50 rounded">
        <h4 className="font-semibold mb-2 text-gray-700">
          Sample File Format:
        </h4>
        <table className="table-auto w-full text-sm border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">type</th>
              <th className="border px-2 py-1">name</th>
              <th className="border px-2 py-1">code</th>
              <th className="border px-2 py-1">parent</th>
              <th className="border px-2 py-1">description</th>
              <th className="border px-2 py-1">status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-2 py-1">Category</td>
              <td className="border px-2 py-1">Electronics</td>
              <td className="border px-2 py-1">ELEC001</td>
              <td className="border px-2 py-1"></td>
              <td className="border px-2 py-1"></td>
              <td className="border px-2 py-1">1</td>
            </tr>
            <tr>
              <td className="border px-2 py-1">Category</td>
              <td className="border px-2 py-1">Furniture</td>
              <td className="border px-2 py-1">FURN001</td>
              <td className="border px-2 py-1"></td>
              <td className="border px-2 py-1"></td>
              <td className="border px-2 py-1">1</td>
            </tr>
          </tbody>
        </table>
        <p className="text-xs text-gray-500 mt-2">
          Notes: Status = 1 means active, 0 means inactive.
        </p>
      </div>
    </AdminLayout>
  );
}
