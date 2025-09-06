import api from "../lib/axios";

export const fetchMasterData = async (params = {}) => {
  try {
    const res = await api.get("/master-data", { params });
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const getMasterData = async (id) => {
  try {
    const res = await api.get(`/master-data/${id}`);
    // Laravel single resource is usually res.data.data
    return res.data?.data ?? res.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const createMasterData = async (payload) => {
  try {
    const res = await api.post("/master-data", payload);
    return res.data?.data ?? res.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const updateMasterData = async (id, payload) => {
  try {
    const res = await api.put(`/master-data/${id}`, payload);
    return res.data?.data ?? res.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const deleteMasterData = async (id) => {
  try {
    const res = await api.delete(`/master-data/${id}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const bulkDeleteMasterData = async (ids) => {
  try {
    const res = await api.post("/master-data/bulk-delete", { ids });
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const getMasterDataTypes = async () => {
  try {
    const res = await api.get("/master-data-types");
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const getActiveMasterData = async () => {
  try {
    const res = await api.get("/active-master-data");
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const masterDataStatusChange = async (id, newStatus) => {
  try {
    const res = await api.patch(`/master-data/${id}/toggle-status`, {
      status: newStatus,
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};


export const masterDataImport = async (formData) => {
  try {
    const res = await api.post(`/master-data/import`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const exportData = async () => {
  try {
    const res = await api.get(`/master-data/export`, {
      responseType: "blob", // 👈 important
    });
    return res; // return full response (not res.data)
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};
