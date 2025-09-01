import api from "../lib/axios";

/**
 * params can include: page, per_page, search, sort, dir
 * returns the entire response data (Laravel resource collection => { data: [...], meta: {...}, links: {...} })
 */
export const fetchPermissions = async (params = {}) => {
  try {
    const res = await api.get("/permissions", { params });
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const getPermission = async (id) => {
  try {
    const res = await api.get(`/permissions/${id}`);
    // Laravel single resource is usually res.data.data
    return res.data?.data ?? res.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const createPermission = async (payload) => {
  try {
    const res = await api.post("/permissions", payload);
    return res.data?.data ?? res.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const updatePermission = async (id, payload) => {
  try {
    const res = await api.put(`/permissions/${id}`, payload);
    return res.data?.data ?? res.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const deletePermission = async (id) => {
  try {
    const res = await api.delete(`/permissions/${id}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const bulkDeletePermissions = async (ids) => {
  try {
    const res = await api.post("/permissions/bulk-delete", { ids });
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};