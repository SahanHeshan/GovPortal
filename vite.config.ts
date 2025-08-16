import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

const __dirname = path.dirname(new URL(".", import.meta.url).pathname);

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  preview: {
    // Allow requests from your Azure Container App host
    allowedHosts: [
      "govconn-portal.ambitioustree-9332536f.eastasia.azurecontainerapps.io",
    ],
  },
}));
