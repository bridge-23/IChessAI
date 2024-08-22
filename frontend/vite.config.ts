import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import environment from "vite-plugin-environment";

// Set the II_URL environment variable based on the network
process.env.II_URL = process.env.DFX_NETWORK === 'local' 
  ? `http://${process.env.INTERNET_IDENTITY_CANISTER_ID}.localhost:4943/` 
  : `https://identity.ic0.app`;

export default defineConfig({
  plugins: [
    react(),
    environment(['II_URL']), // Ensure II_URL is available in your environment variables
  ],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
});