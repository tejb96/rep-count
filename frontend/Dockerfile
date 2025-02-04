# Build Stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Webserver Stage
FROM node:18-alpine

WORKDIR /app

# Install http-server
RUN npm install -g http-server

# Copy built React app and certificates
COPY --from=build /app/build /app/build
COPY certs/localhost.crt /app/certs/localhost.crt
COPY certs/localhost.key /app/certs/localhost.key

# Expose HTTPS port
EXPOSE 443

# Serve the app with HTTPS
CMD ["http-server", "build", "--cert", "/app/certs/localhost.crt", "--key", "/app/certs/localhost.key", "-p", "443"]
