import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import Cookies from 'js-cookie';

const API_URL = import.meta.env.VITE_API_URL;
let deviceId = localStorage.getItem('deviceId');
if (!deviceId) {
    deviceId = uuidv4();
    localStorage.setItem('deviceId', deviceId);
}
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

api.interceptors.request.use(
    async (config) => {
        if (deviceId) {
            config.headers['X-Device-Id'] = deviceId;
        }
        const csrfToken = Cookies.get('CSRF-Token');
        if (csrfToken) {
            config.headers['X-CSRF-Token'] = csrfToken;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
let isRefreshing = false;
let failedQueue: any[] = [];
const processQueue = (error: any) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve();
        }
    });
    failedQueue = [];
};
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (!error.response && (error.code === 'ERR_NETWORK' || error.code === 'ERR_CONNECTION_REFUSED')) {
            toast.error('Unable to connect to the server. Please check your internet connection or try again later.', {
                id: 'network-error'
            });
            return Promise.reject(error);
        }
        if (error.response?.status === 503) {
            const reason = error.response.data?.reason || 'Service Unavailable';
            toast.error(reason, {
                id: 'service-unavailable'
            });
            return Promise.reject(error);
        }
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => {
                        return api(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }
            originalRequest._retry = true;
            isRefreshing = true;
            try {
                const csrfToken = Cookies.get('CSRF-Token');
                const headers: Record<string, string> = {
                    'X-Device-Id': deviceId
                };
                if (csrfToken) {
                    headers['X-CSRF-Token'] = csrfToken;
                }
                await axios.post(`${API_URL}/auth-service/refresh-access-token`, {}, {
                    headers,
                    withCredentials: true
                });
                processQueue(null);
                return api(originalRequest);
            } catch (refreshError) {
                if (window.location.pathname !== '/login') {
                    window.dispatchEvent(new Event('auth:session-expired'));
                    failedQueue = [];
                    return new Promise(() => { });
                }
                processQueue(refreshError);
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);

export default api;
