# React 빌드
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN rm -f package-lock.json
RUN npm install

COPY . .
RUN npm run build

# Nginx를 통해 정적 파일 서빙
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# 기본 Nginx 초기 파일 제거 후 빌드된 리소스 복사
RUN rm -rf ./*
COPY --from=builder /app/dist .

# Nginx설정 파일 적용
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]