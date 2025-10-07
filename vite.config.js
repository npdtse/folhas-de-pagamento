import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // Adicione esta linha:
  base: '/folhas-de-pagamento/', 
  plugins: [react()],
})
