import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8000,
    host: '0.0.0.0',
    cors: true
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          router: ["react-router-dom"],
          mui: [ "@mui/material", "@mui/icons-material", "@emotion/react", "@emotion/styled", "stylis", "stylis-plugin-rtl" ],
          query: ["@tanstack/react-query"],
          zustand: ["zustand"],
          form: ["formik", "yup"],
          date: ["jalali-moment"],
          pdf: [ "jspdf", "pdfmake", "html2canvas" ],
          excel: [ "exceljs", "file-saver" ],
          utils: ["axios", "he", "react-helmet-async"]
        }
      }
    },
    chunkSizeWarningLimit: 2000
  }
})
