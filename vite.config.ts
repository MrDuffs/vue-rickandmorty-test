import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

// https://vite.dev/config/
/** @type {import('vite').UserConfig} */
export default defineConfig(async () => ({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      assets: fileURLToPath(new URL('./src/assets', import.meta.url)),
      components: fileURLToPath(new URL('./src/components', import.meta.url)),
      stores: fileURLToPath(new URL('./src/stores', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
            @use '@/assets/styles/variables' as *;
          `,
        charset: false,
      },
    },
  },
}));
