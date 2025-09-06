import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { debounce } from "lodash"; // or write your own small debounce

import {
  fetchMasterData,
  deleteMasterData,
  masterDataStatusChange,
  exportData,
} from "../../services/masterDataService";

import Swal from "sweetalert2";
import AdminLayout from "../../layouts/AdminLayout";

import Pagination from "../../components/Pagination";
import TableLoader from "../../components/TableLoader";
import TableFooter from "../../components/TableFooter";
import SearchBox from "../../components/SearchBox";
import ActionButton from "../../components/ActionButton";
import PageTitle from "../../components/PageTitle";

import { usePermissions } from "../../context/PermissionsContext";

export default function MasterDataList() {
  const { hasPermission } = usePermissions();

  const [MasterDataPayload, setMasterDataPayload] = useState({
    data: [],
    meta: {},
    links: {},
  });
  const [page, setPage] = useState(1);

  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState(q);

  const [loading, setLoading] = useState(false);
  const perPage = 10;

  const [sort, setSort] = useState("id"); // or 'type', 'name', etc.
  const [dir, setDir] = useState("desc");

  const [types, setTypes] = useState([]);
  const [parents, setParents] = useState([]);

  const [typeFilter, setTypeFilter] = useState("");
  const [parentFilter, setParentFilter] = useState("");

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
    const loadMasterData = async () => {
      setLoading(true);
      try {
        const data = await fetchMasterData({
          page,
          per_page: perPage,
          search: q,
          sort,
          dir,
          type: typeFilter || undefined, // include type filter
          parent: parentFilter || undefined,
        });
        console.log(data);
        setMasterDataPayload(data);
        setTypes(data.types);
        setParents(data.parents);
      } catch (err) {
        console.error(err);
        Swal.fire("Error", err.message || "Failed to load MasterData", "error");
      } finally {
        setLoading(false);
      }
    };

    loadMasterData();
  }, [page, debouncedQ, typeFilter, parentFilter, sort, dir]); // use debouncedQ here

  // Handle search
  const handleSearch = () => {
    setPage(1); // reset to first page on new search
  };

  // Handle delete
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Master Data?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteMasterData(id);
      Swal.fire("Deleted", "Master Data deleted successfully", "success");

      // if last master-data on page deleted, move back a page if possible
      if (MasterDataPayload.length === 1 && page > 1) {
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

  const handleStatusChange = async (id, newStatus) => {
    try {
      const updated = await masterDataStatusChange(id, newStatus);
      Swal.fire(
        "Status Updated",
        "Master Data status updated successfully",
        "success"
      );

      // Update the local state directly
      setMasterDataPayload((prev) => ({
        ...prev,
        data: prev.data.map((item) =>
          item.id === id ? { ...item, status: updated.data.status } : item
        ),
      }));
    } catch (error) {
      Swal.fire("Error", error.message || "Delete failed", "error");
    }
  };

  const handleSort = (column) => {
    if (sort === column) {
      // toggle direction
      setDir(dir === "asc" ? "desc" : "asc");
    } else {
      // change column, reset to asc
      setSort(column);
      setDir("asc");
    }
    setPage(1); // reset pagination
  };

  const handleExport = async () => {
    try {
      const response = await exportData();
      const url = window.URL.createObjectURL(new Blob([response.data])); // 👈 use response.data directly

      const a = document.createElement("a");
      a.href = url;
      a.download = "master-data.xlsx"; // file name
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error("Export failed", err);
    }
  };

  return (
    <AdminLayout title="Master Data">
      {/* Page Title */}
      <PageTitle title="Master Data" subtitle="Manage all system Master Data" />
      <div className="py-2">
        <div className="flex mb-1 text-nowrap">
          <select
            name="type"
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(1); // reset page when filter changes
            }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">--Filter By Type--</option>
            {types.map((val, index) => (
              <option key={index} value={val}>
                {val}
              </option>
            ))}
          </select>

          <select
            name="parent"
            value={parentFilter}
            onChange={(e) => {
              setParentFilter(e.target.value);
              setPage(1); // reset page when filter changes
            }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">--Filter By Parent--</option>
            {parents.map((val) => (
              <option key={val.id} value={val.id}>
                {val.name}
              </option>
            ))}
          </select>

          <SearchBox
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onSearch={handleSearch}
            placeholder="Seek here by MasterData name or module"
          />

          <ActionButton type="refresh" onClick={() => setPage(1)}>
            Refresh
          </ActionButton>
          {hasPermission("add-master-data") && (
            <ActionButton type="add" to={`/master-data/create`}>
              New Master Data
            </ActionButton>
          )}
          {hasPermission("import-master-data") && (
            <ActionButton type="import" to={`/master-data/import`}>
              Import
            </ActionButton>
          )}
          {hasPermission("export-master-data") && (
            <ActionButton type="export" onClick={handleExport}>
              Export
            </ActionButton>
          )}
        </div>

        {/* Permissions table */}
        <div className="bg-white border rounded-lg overflow-x-auto">
          <table className="min-w-full text-sm border border-gray-300 border-collapse rounded-lg overflow-hidden shadow-sm">
            <thead className="bg-gray-200 text-gray-700 font-semibold">
              <tr>
                <th
                  className="p-3 text-center border border-gray-700 "
                  onClick={() => handleSort("id")}
                >
                  Sl No {sort === "id" && (dir === "asc" ? "▲" : "▼")}
                </th>
                <th
                  className="p-3 text-left border border-gray-700"
                  onClick={() => handleSort("type")}
                >
                  Type {sort === "type" && (dir === "asc" ? "▲" : "▼")}
                </th>
                <th
                  className="p-3 text-left border border-gray-700"
                  onClick={() => handleSort("name")}
                >
                  Name {sort === "name" && (dir === "asc" ? "▲" : "▼")}
                </th>
                <th
                  className="p-3 text-left border border-gray-700"
                  onClick={() => handleSort("name")}
                >
                  Code {sort === "code" && (dir === "asc" ? "▲" : "▼")}
                </th>
                <th className="p-3 text-left border border-gray-700">Parent</th>
                <th className="p-3 text-left border border-gray-700">
                  Description
                </th>
                <th className="p-3 text-left border border-gray-300 text-center">
                  Status
                </th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableLoader rows={10} cols={8} />
              ) : MasterDataPayload.data.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center">
                    No masterdata found.
                  </td>
                </tr>
              ) : (
                MasterDataPayload.data.map((u, index) => (
                  <tr
                    key={index + 1}
                    className="odd:bg-white even:bg-gray-50 transition hover:bg-gray-100 hover:text-gray-900"
                  >
                    <td className="p-1 border  border-gray-300 text-center">
                      {u.id}
                    </td>
                    <td className="p-1 border  border-gray-300">{u.type}</td>
                    <td className="p-1 border  border-gray-300">{u.name}</td>
                    <td className="p-1 border  border-gray-300">{u.code}</td>
                    <td className="p-1 border  border-gray-300">
                      {u.parent?.name}
                    </td>
                    <td className="p-1 border  border-gray-300">
                      {u.description}
                    </td>
                    <td className="p-1 border border-gray-300 text-center">
                      {u.status ? (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 border-1 border-green-900">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700 border-1 border-red-900">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="p-1 border border-gray-300 text-right space-x-2">
                      {/* Toggle Active / Inactive */}
                      {hasPermission("edit-master-data") &&
                        (u.status ? (
                          <ActionButton
                            type="deactivate"
                            onClick={() => handleStatusChange(u.id, false)}
                          ></ActionButton>
                        ) : (
                          <ActionButton
                            type="activate"
                            onClick={() => handleStatusChange(u.id, true)}
                          ></ActionButton>
                        ))}
                      {hasPermission("view-master-data") && (
                        <ActionButton type="view" to={`/master-data/${u.id}`}>
                          View
                        </ActionButton>
                      )}
                      {hasPermission("edit-master-data") && (
                        <ActionButton
                          type="edit"
                          to={`/master-data/${u.id}/edit`}
                        >
                          Edit
                        </ActionButton>
                      )}
                      {hasPermission("delete-master-data") && (
                        <ActionButton
                          type="delete"
                          onClick={() => handleDelete(u.id)}
                        >
                          Eliminate/ abolish
                        </ActionButton>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <TableFooter meta={MasterDataPayload.meta} />
        </div>

        {/* Pager */}
        <Pagination
          page={page}
          setPage={setPage}
          lastPage={MasterDataPayload.meta?.last_page || 1}
        />
      </div>
    </AdminLayout>
  );
}
