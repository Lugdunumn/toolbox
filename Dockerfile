FROM node:18 as build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist/toolbox /usr/share/nginx/html
COPY --from=build /app/scripts /app/scripts
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Install Node.js for the config script
RUN apk add --update nodejs

# Run watcher script in background
CMD ["/bin/sh", "-c", "node /app/scripts/watch-config.js & nginx -g 'daemon off;'"]