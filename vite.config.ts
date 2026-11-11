import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react(), tailwindcss()],

  build: {
    // Keep the long-lived libraries separate from application code. This
    // improves caching and prevents the main entry chunk from growing just
    // because a large dependency changes.
    rollupOptions: {
      output: {
        manualChunks(id) {
          const moduleId = id.replaceAll('\\', '/');
          if (!moduleId.includes('/node_modules/')) return;

          // Three.js is only reached through the lazy cinematic scene, so it
          // remains off the initial route while keeping that boundary obvious.
          if (moduleId.includes('/node_modules/three/')) {
            return 'vendor-three';
          }

          if (
            /\/node_modules\/(?:motion|framer-motion|motion-dom|motion-utils)\//.test(
              moduleId,
            )
          ) {
            return 'vendor-motion';
          }

          return 'vendor';
        },
      },
    },

    // The deliberately isolated Three.js chunk (core plus the bloom
    // post-processing passes) is above Vite's generic 500 kB default, but is
    // lazy-loaded and about 150 kB over gzip. Keep a close warning budget
    // instead of disabling the check.
    chunkSizeWarningLimit: 620,
  },
})
