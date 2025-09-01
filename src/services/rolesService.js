import api from "../lib/axios";

/**
 * params can include: page, per_page, search, sort, dir
 * returns the entire response data (Laravel resource collection => { data: [...], meta: {...}, links: {...} })
 */
export const fetchRoles = async (params = {}) => {
  try {
    const res = await api.get("/roles", { params });
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const getRole = async (id) => {
  try {
    const res = await api.get(`/roles/${id}`);
    // Laravel single resource is usually res.data.data
    return res.data?.data ?? res.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const getPermissions = async () => {
  try {
    const res = await api.get("/role-permissions");
    return res.data?.data ?? res.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const createRole = async (payload) => {
  try {
    const res = await api.post("/roles", payload);
    return res.data?.data ?? res.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const updateRole = async (id, payload) => {
  try {
    const res = await api.put(`/roles/${id}`, payload);
    return res.data?.data ?? res.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const deleteRole = async (id) => {
  try {
    const res = await api.delete(`/roles/${id}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const bulkDeleteRoles = async (ids) => {
  try {
    const res = await api.post("/roles/bulk-delete", { ids });
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};