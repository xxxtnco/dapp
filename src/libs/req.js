import axios from 'axios';
import { showNotify, showToast, closeToast } from 'vant';
import router from '@/router';
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
const config = {
    timeout: 60000, // Timeout
    // withCredentials: true, // Check cross-site Access-Control
};

const _axios = axios.create(config);

// 请求前
_axios.interceptors.request.use(
    function (config) {
        // Do something before request is sent
        if (config.loading) {
            showToast({
                type: 'loading',
                message: '...',
                overlay: true,
                forbidClick: true,
                duration: 0,
            });
        }

        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    }
);

// 请求结束
_axios.interceptors.response.use(
    function (response) {
        if (response.config.loading) {
            closeToast();
        }
        // 登录会话过期
        if (response.data?.code === 401) {
            const { code, msg } = response.data;
            showToast(msg);
            const adr = window.localStorage.getItem('a');
            window.localStorage.removeItem(`t-${adr}`);
            window.localStorage.removeItem(`a`);
            // location.reload(true);
            // console.log(router);
            router.replace({ path: '/' });
            if (!((response.config.url.indexOf('/login') === -1) && (response.config.url.indexOf('/nonce') === -1))) {
                // console.log(window.localStorage.getItem('a'));
                if (!window.localStorage.getItem('a')) {
                    window.location.reload();
                }
            }
            return Promise.reject(response.data);
        }
        // 业务请求
        if (response.data?.code !== 200) {
            const { code, msg } = response.data;
            showNotify({ type: 'danger', message: `${msg}` });
            return Promise.reject(response.data || '');
        }

        return response.data.data;
    },
    function (error) {
        if (error.config.loading) {
            closeToast();
        }
        //常见网络异常处理
        if (!error.data) {
            let str = error + '';
            if (str.search('timeout') !== -1) {
                showNotify({ type: 'danger', message: `请求超时` });
            } else if (str.search('Network') !== -1) {
                showNotify({ type: 'danger', message: `网络错误` });
            } else {
                showNotify({ type: 'danger', message: `糟糕，出错了` });
            }
        }
        return Promise.reject(error);
    }
);

export default _axios;
