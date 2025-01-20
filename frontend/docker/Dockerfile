# Both stages must use alpine
FROM node:23.6.0-alpine3.21 AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

# Relative to build context
COPY . ./

ENV NODE_ENV=production
RUN npm run build

#-----------------------

# This has no node, works only for CSR
FROM nginx:1.23.3-alpine AS webserver

WORKDIR /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/*
RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/build .
COPY --from=build /app/docker/default.conf /etc/nginx/conf.d/default.conf
COPY docker/localhost-certs/localhost.crt /etc/ssl/certs/localhost.crt
COPY docker/localhost-certs/localhost.key /etc/ssl/private/localhost.key

EXPOSE 80
EXPOSE 443
ENTRYPOINT ["nginx", "-g", "daemon off;"]
