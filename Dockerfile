FROM node:20-alpine AS builder
LABEL authors="William Loosman"

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build


FROM nginx:1.25.5-alpine

COPY --from=builder /app/build /usr/share/nginx/html
COPY /nginx/default.conf /etc/nginx/conf.d/default.conf