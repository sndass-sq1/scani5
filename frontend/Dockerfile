# Build Phase
FROM node:22-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY . .
RUN npm run build

# Production Phase: Use Nginx to serve build
FROM nginx:alpine

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy React build to Nginx public folder
COPY --from=build /app/build /usr/share/nginx/html

# Optional: Uncomment if you have a custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
