import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/jobiai/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authAPI = {
    signup: (data: { email: string; password: string; name: string; role: string }) =>
        api.post('/signup', data),
    signin: (data: { email: string; password: string }) =>
        api.post('/signin', data),
    getProfile: () => api.get('/profile'),
    getAllUsers: () => api.get('/users'),
    deleteAccount: () => api.delete('/delete'),
    deleteUserByAdmin: (id: string) => api.delete(`/admin-delete/${id}`),
    requestPasswordReset: (email: string) =>
        api.post('/request-password-reset', { email }),
    verifyResetCode: (data: { email: string; code: string }) =>
        api.post('/verify-reset-code', data),
    resetPassword: (data: { email: string; code: string; newPassword: string }) =>
        api.post('/reset-password', data),
    logout: () => {
        localStorage.removeItem('token');
        return Promise.resolve();
    }
};

export const companyAPI = {
    create: (data: any) => api.post('/company/add', data),
    getAll: () => api.get('/company/all'),
    getByUser: () => api.get('/company'),
    getById: (id: string) => api.get(`/company/${id}`),
    getByUserId: (userId: string) => api.get(`/company/user/${userId}`),
    update: (id: string, data: any) => api.put(`/company/${id}`, data),
    delete: (id: string) => api.delete(`/company/${id}`),
};

export const jobAPI = {
    create: (data: any) => api.post('/job/add', data),
    getAll: () => api.get('/job/all'),
    getByCompany: (id: string) => api.get(`/job/by-company/${id}`),
    getByUserCompany: () => api.get('/job/all/companyJobs'),
    getById: (id: string) => api.get(`/job/${id}`),
    update: (id: string, data: any) => api.put(`/job/${id}`, data),
    delete: (id: string) => api.delete(`/job/${id}`),
    search: (query: string) => api.get(`/job/search?q=${query}`),
};

export const resumeAPI = {
    create: (data: any) => api.post('/resume/add', data),
    getAll: () => api.get('/resume/all'),
    getByUser: () => api.get('/resume'),
    getById: (id: string) => api.get(`/resume/${id}`),
    update: (id: string, data: any) => api.put(`/resume/${id}`, data),
    delete: (id: string) => api.delete(`/resume/${id}`),
    search: (query: string) => api.get(`/resume/search?q=${query}`),
    getByUserId: (userId: string) => api.get(`/resume/user/${userId}`),
};

export const candidacyAPI = {
    apply: (data: any) => api.post('/candidacy/apply', data),
    getByCandidate: () => api.get('/candidacy'),
    getByJob: (jobId: string) => api.get(`/candidacy/job/${jobId}`),
    updateStatus: (id: string, status: string) =>
        api.put(`/candidacy/${id}`, { status }),
    delete: (id: string) => api.delete(`/candidacy/${id}`),
    getAll: () => api.get('/candidacy/all'),
};

export const notificationAPI = {
    fetchMy: () => api.get('/notification/my'),
    markAsRead: (id: string) => api.patch(`/notification/${id}/read`),
    delete: (id: string) => api.delete(`/notification/${id}`),
};

export default api;