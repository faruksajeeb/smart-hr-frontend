import api from "../lib/axios";

/**
 * params can include: page, per_page, search, sort, dir
 * returns the entire response data (Laravel resource collection => { data: [...], meta: {...}, links: {...} })
 */
export const fetchUsers = async (params = {}) => {
  try {
    const res = await api.get("/users", { params });
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const getUser = async (id) => {
  try {
    const res = await api.get(`/users/${id}`);
    // Laravel single resource is usually res.data.data
    return res.data?.data ?? res.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const createUser = async (payload) => {
  try {
    const res = await api.post("/users", payload);
    return res.data?.data ?? res.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const updateUser = async (id, payload) => {
  try {
    const res = await api.put(`/users/${id}`, payload);
    return res.data?.data ?? res.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const deleteUser = async (id) => {
  try {
    const res = await api.delete(`/users/${id}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const bulkDeleteUsers = async (ids) => {
  try {
    const res = await api.post("/users/bulk-delete", { ids });
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};