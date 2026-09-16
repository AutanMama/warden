import api from "./client";

export const listRequests = () => api.get("/requests").then((r) => r.data.requests);
export const createRequest = (data) => api.post("/requests", data).then((r) => r.data.request);
export const getRequest = (id) => api.get(`/requests/${id}`).then((r) => r.data.request);
export const getRequestHistory = (id) => api.get(`/requests/${id}/history`).then((r) => r.data.history);
export const approveRequest = (id) => api.post(`/requests/${id}/approve`).then((r) => r.data.request);
export const rejectRequest = (id) => api.post(`/requests/${id}/reject`).then((r) => r.data.request);

export const listUsers = () => api.get("/users").then((r) => r.data.users);
export const listAuditLog = () => api.get("/audit-log").then((r) => r.data.events);
