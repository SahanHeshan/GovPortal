import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  preview: {
    host: "0.0.0.0",
    port: 4173,
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "govconn-portal.ambitioustree-9332536f.eastasia.azurecontainerapps.io",
      ".azurecontainerapps.io", // Allow all Azure Container Apps domains
    ],
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
