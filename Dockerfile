# ========================
# 1. Build Angular app
# ========================
FROM node:18 AS build

WORKDIR /app

# Copy package trước để cache
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Build Angular
RUN npm run build --prod

# ========================
# 2. Serve bằng Nginx
# ========================
FROM nginx:alpine

# Xoá default web
RUN rm -rf /usr/share/nginx/html/*

# ⚠️ QUAN TRỌNG: sửa đúng tên app
COPY --from=build /app/dist/<your-app-name> /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]