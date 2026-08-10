FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration production

FROM nginx:alpine
COPY --from=build /app/dist/retirement-dashboard/browser /usr/share/nginx/html
# Entrypoint runs envsubst on templates at startup; API_PROXY_URL can be
# overridden per environment (e.g. Railway internal hostname)
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
ENV API_PROXY_URL=http://backend:8080
# Populate NGINX_LOCAL_RESOLVERS from the container's /etc/resolv.conf
ENV NGINX_ENTRYPOINT_LOCAL_RESOLVERS=1
# Set to "ipv4=off" on IPv6-only platforms (e.g. Railway private networking)
ENV NGINX_RESOLVER_FLAGS=""
EXPOSE 80
