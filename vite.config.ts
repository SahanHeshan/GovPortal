import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 4173,
  },
  preview: {
    host: "0.0.0.0",
    port: 4173,
    allowedHosts: [
      "govconn-portal.ambitioustree-9332536f.eastasia.azurecontainerapps.io",
      ".azurecontainerapps.io",
      "all", // Allow all Azure Container Apps domains
    ],
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
