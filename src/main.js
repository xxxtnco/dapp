import {createApp} from 'vue';
import {createPinia} from 'pinia';

import App from './App.vue';
import router from './router';
import i18n from './i18n.js';
import "amfe-flexible/index.js";
import 'vant/es/toast/style';
import 'vant/es/notify/style';
import 'vant/es/dialog/style';
import '@/assets/styles/initialize.css';
import '@/assets/styles/base.css';
import { PullRefresh } from 'vant';
import {showToast} from 'vant';
import {copyText} from '@/libs/utils';
import myNav from '@/views/components/MainTitle.vue'
import Menu from "@/views/components/Menu.vue";
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'

const app = createApp(App);
app.component('my-nav', myNav)
app.component('my-menu', Menu)
app.use(createPinia());
app.use(PullRefresh);
app.use(router);
app.use(i18n);
app.use(Antd)
app.mixin({
    directives: {
        // 长按事件
        'long-press': {
            mounted(el, binding) {
                let pressTimer = null;
                const duration = 500;

                const start = (e) => {
                    if (e.type === 'click') {
                        return;
                    }
                    if (pressTimer === null) {
                        pressTimer = setTimeout(() => {
                            binding.value(e);
                            navigator.vibrate([2]);
                            cancel();
                        }, duration);
                    }
                };

                const cancel = () => {
                    if (pressTimer !== null) {
                        clearTimeout(pressTimer);
                        pressTimer = null;
                    }
                };

                // 添加事件监听器
                el.addEventListener('mousedown', start);
                el.addEventListener('touchstart', start, {passive: true});
                // 取消计时器
                el.addEventListener('click', cancel);
                el.addEventListener('touchmove', cancel, {passive: true});
                el.addEventListener('mouseout', cancel);
                el.addEventListener('touchend', cancel, {passive: true});
                el.addEventListener('touchcancel', cancel, {passive: true});
                el.addEventListener('contextmenu', function (e) {
                    e.preventDefault();
                });
            },
        },

        // 复制
        'copy': {
            mounted(el, binding) {
                const start = async (e) => {
                    const text = binding.value;
                    const val = text.constructor === Function ? text() : String(text)
                    await copyText(val);
                    showToast(val);
                };

                el.addEventListener('click', start);
                el.addEventListener('touchend', start);
            },
        },

    },
});

router.beforeEach((to, from) => {
    if (to.meta.title) {
        document.title = to.meta.title;
    }
});

app.mount('#app');
