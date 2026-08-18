import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    react(),
    dts({ rollupTypes: true, tsconfigPath: './tsconfig.build.json' }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@zdy-oa/utils': resolve(__dirname, '../oa-utils/src/index.ts'),
      '@zdy-oa/designer': resolve(__dirname, '../oa-designer/src/index.ts'),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MyOaForm',
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
    },
  },
})
