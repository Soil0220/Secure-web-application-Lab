import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// 쿠키 추출 유틸리티
const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
};

const client = axios.create({
    baseURL: 'http://localhost:8080/api',
    withCredentials: true,
});

// Request Interceptor: custom flag(withCsrf) 확인 후 헤더 주입
client.interceptors.request.use((config) => {
    // 1. 공통 헤더 주입
    config.headers['X-Request-Id'] = uuidv4();
    config.headers['X-Request-Time'] = new Date().toISOString();

    // 2. withCsrf 옵션이 true일 때만 XSRF-TOKEN 헤더 추가 (기본값: true)
    if (config.withCsrf !== false) {
        const xsrfToken = getCookie('XSRF-TOKEN');
        if (xsrfToken) {
            config.headers['XSRF-TOKEN'] = decodeURIComponent(xsrfToken);
        }
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

/**
 * @param {string} url - 요청 URL
 * @param {object} bodyData - Body 데이터
 * @param {boolean} [useCsrf=true] - CSRF 토큰 전송 여부 (기본값: true)
 * @param {object} [extraConfig={}] - 추가 Axios 설정 (headers 등)
 */
export const postApi = (url, bodyData, useCsrf = true, extraConfig = {}) => {
    return client.post(url, bodyData, {
        withCsrf: useCsrf,
        ...extraConfig,
    });
};

export const patchApi = (url, bodyData, useCsrf = true, extraConfig = {}) => {
    return client.patch(url, bodyData, {
        withCsrf: useCsrf,
        ...extraConfig,
    });
};

export const getApi = (url, paramsData = {}, useCsrf = false, extraConfig = {}) => {
    // GET 요청은 조회용이므로 기본값을 false로 지정 (필요 시 true 전달 가능)
    return client.get(url, {
        params: paramsData,
        withCsrf: useCsrf,
        ...extraConfig,
    });
};

export const deleteApi = (url, paramsData = {}, useCsrf = true, extraConfig = {}) => {
    return client.delete(url, {
        params: paramsData,
        withCsrf: useCsrf,
        ...extraConfig,
    });
};