import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const client = axios.create({
    baseURL: 'http://localhost:8080/api',
});

// 모든 요청 직전에 헤더 주입
client.interceptors.request.use((config) => {
    config.headers['X-Request-Id'] = uuidv4();
    config.headers['X-Request-Time'] = new Date().toISOString();
    return config;
});

export const postApi = (url, bodyData) => {
    return client.post(url, bodyData);
};

export const putApi = (url, bodyData) => {
    return client.put(url, bodyData);
};

export const getApi = (url, paramsData = {}) => {
    return client.get(url, { params: paramsData });
};

export const deleteApi = (url, paramsData = {}) => {
    return client.delete(url, { params: paramsData });
};