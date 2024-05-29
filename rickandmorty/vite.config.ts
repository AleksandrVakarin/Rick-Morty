import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

const baseConfig = process.env.NODE_ENV === 'production' ? '/Rick-Morty/' : '/';

export default defineConfig({
  plugins: [vue()],
  base: baseConfig,
})
