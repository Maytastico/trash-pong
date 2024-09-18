FROM nginx:alpine

COPY ./export /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080


# Starte den Nginx-Webserver
CMD ["nginx", "-g", "daemon off;"]

