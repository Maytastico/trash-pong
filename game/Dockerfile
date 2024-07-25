# Verwende das offizielle Nginx-Image als Basis
FROM nginx:alpine

# Kopiere die exportierten Dateien des Spiels in das Verzeichnis, das vom Nginx-Webserver bedient wird
COPY ./export /usr/share/nginx/html

# Kopiere die angepasste Nginx-Konfiguration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponiere den Standard-HTTP-Port
EXPOSE 80

# Exponiere den WebSocket-Port (falls du dies benötigst)
EXPOSE 8910

# Starte den Nginx-Webserver
CMD ["nginx", "-g", "daemon off;"]

