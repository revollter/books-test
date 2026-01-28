FROM node:20-alpine AS builder

WORKDIR /app
COPY package.json ./
RUN npm install

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY . /usr/share/nginx/html
COPY --from=builder /app/node_modules /usr/share/nginx/html/node_modules

EXPOSE 80
