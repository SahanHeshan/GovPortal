# Stage 1: Build Vite frontend
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine

# Remove default Nginx files
RUN rm -rf /usr/share/nginx/html/*

# Copy built frontend
COPY --from=builder /app/dist /usr/share/nginx/html

# Optional: custom nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
