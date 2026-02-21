import apiClient from './client';

// ─── Tasks ──────────────────────────────────────────────────────────────────

export const getTasks = (params = {}) =>
    apiClient.get('/api/tasks/', { params }).then((r) => r.data);

export const getTask = (id) =>
    apiClient.get(`/api/tasks/${id}/`).then((r) => r.data);

export const createTask = (data) =>
    apiClient.post('/api/tasks/', data).then((r) => r.data);

export const updateTask = (id, data) =>
    apiClient.patch(`/api/tasks/${id}/`, data).then((r) => r.data);

export const deleteTask = (id) =>
    apiClient.delete(`/api/tasks/${id}/`).then((r) => r.data);

export const completeTask = (id) =>
    apiClient.post(`/api/tasks/${id}/complete/`).then((r) => r.data);

export const getStatistics = () =>
    apiClient.get('/api/tasks/statistics/').then((r) => r.data);

export const getOverdueTasks = () =>
    apiClient.get('/api/tasks/overdue/').then((r) => r.data);

export const bulkAssignTasks = (taskIds, assignedToId) =>
    apiClient
        .post('/api/tasks/bulk_assign/', { task_ids: taskIds, assigned_to_id: assignedToId })
        .then((r) => r.data);

// ─── Completed Tasks ─────────────────────────────────────────────────────────

export const getCompletedTasks = (params = {}) =>
    apiClient.get('/api/completed-tasks/', { params }).then((r) => r.data);

export const getRecentCompleted = (days = 7) =>
    apiClient.get('/api/completed-tasks/recent/', { params: { days } }).then((r) => r.data);

export const getCompletionReport = (days = 30) =>
    apiClient.get('/api/completed-tasks/report/', { params: { days } }).then((r) => r.data);
