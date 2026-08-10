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
EXPOSE 80
