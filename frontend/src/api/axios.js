import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:3000',
});

// Đoạn này cực kỳ quan trọng để sửa lỗi 401
axiosClient.interceptors.request.use((config) => {
    // Lấy token từ LocalStorage
    const token = localStorage.getItem('access_token');
    if (token) {
        // Nhét token vào Header của mọi API gửi đi
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosClient;