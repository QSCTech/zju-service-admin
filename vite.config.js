import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/zjurs/static/",
  plugins: [vue()],
  /*
  build: {
    rollupOptions: {
      external: ['vue'],
    },
  },
  /*
  server: {
    proxy: {
      '^/api': {
        target: 'https://www.qsc.zju.edu.cn/zjurs/api/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    }
  },
  */
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
})
