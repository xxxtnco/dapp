import {fileURLToPath, URL} from 'node:url';
import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import {VantResolver} from 'unplugin-vue-components/resolvers';
import compressPlugin from 'vite-plugin-compression';
import cssPlugin from 'postcss-pxtorem';
import { NgmiPolyfill } from 'vite-plugin-ngmi-polyfill'
import nodePolyfills from 'rollup-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        host: '0.0.0.0',
        // port: 7896,
        port: 80,
        proxy: {
            '/apis': {
                // target: 'https://magic.jbylc.cc',
                target:"http://192.168.1.19:9029",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/apis/, ''),
            },
        },
    },
    base: './',
    plugins: [
        vue(),
        Components({
            resolvers: [VantResolver()],
        }),
        compressPlugin(),
        NgmiPolyfill(),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            util: 'rollup-plugin-node-polyfills/polyfills/util',
            sys: 'util',
            events: 'rollup-plugin-node-polyfills/polyfills/events',
            stream: 'rollup-plugin-node-polyfills/polyfills/stream',
            path: 'rollup-plugin-node-polyfills/polyfills/path',
            querystring: 'rollup-plugin-node-polyfills/polyfills/qs',
            punycode: 'rollup-plugin-node-polyfills/polyfills/punycode',
            url: 'rollup-plugin-node-polyfills/polyfills/url',
            http: 'rollup-plugin-node-polyfills/polyfills/http',
            https: 'rollup-plugin-node-polyfills/polyfills/http',
            os: 'rollup-plugin-node-polyfills/polyfills/os',
            assert: 'rollup-plugin-node-polyfills/polyfills/assert',
            constants: 'rollup-plugin-node-polyfills/polyfills/constants',
            _stream_duplex: 'rollup-plugin-node-polyfills/polyfills/readable-stream/duplex',
            _stream_passthrough: 'rollup-plugin-node-polyfills/polyfills/readable-stream/passthrough',
            _stream_readable: 'rollup-plugin-node-polyfills/polyfills/readable-stream/readable',
            _stream_writable: 'rollup-plugin-node-polyfills/polyfills/readable-stream/writable',
            _stream_transform: 'rollup-plugin-node-polyfills/polyfills/readable-stream/transform',
            timers: 'rollup-plugin-node-polyfills/polyfills/timers',
            console: 'rollup-plugin-node-polyfills/polyfills/console',
            vm: 'rollup-plugin-node-polyfills/polyfills/vm',
            zlib: 'rollup-plugin-node-polyfills/polyfills/zlib',
            tty: 'rollup-plugin-node-polyfills/polyfills/tty',
            domain: 'rollup-plugin-node-polyfills/polyfills/domain',
            buffer: 'rollup-plugin-node-polyfills/polyfills/buffer-es6', // add buffer
            process: 'rollup-plugin-node-polyfills/polyfills/process-es6', // add process
            'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
        },
    },
    css: {
        postcss: {  
            plugins: [
                cssPlugin({
                    rootValue: 75.0,
                    unitPrecision: 5,
                    propList: ['*'],
                    replace: true,
                    mediaQuery: false,
                    minPixelValue: 0,
                    exclude: /node_modules/i,
                }),
            ],
        },
    },
    build: {
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
            plugins: [nodePolyfills()],
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        return id.toString().split('node_modules/')[1].split('/')[0].toString();
                    }
                },
            },
        },
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
            },
        },
    },
});
