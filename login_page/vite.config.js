import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
    build: {
    rollupOptions: {
      external: ['@supabase/supabase-js'], // Add "@supabase/supabase-js" to external
    },
  },
});
