import {createI18n} from 'vue-i18n';
import zh from './locales/zh.json';
import en from './locales/en.json';

const locales = {
    zh,
    en,
};

const languages = (navigator.language || 'en').split('-')[0].toLowerCase();
const i18n = createI18n({
    legacy: false,
    locale: localStorage.getItem('lang') || languages || 'en',
    messages: locales,
    fallbackLocale: 'zh'
});

export default i18n;