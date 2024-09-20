# Nginx als Loadbalancer konfigurieren

Diese Anleitung beschreibt, wie man Nginx als Loadbalancer konfiguriert und die Clients erweitern kann.

## Konfiguration

Fügen Sie die folgende Konfiguration in Ihre Nginx-Konfigurationsdatei ein:

```nginx
upstream loadbalancer {
    ip_hash;
    server pong-reimagined-backend-1:3000;
    server pong-reimagined-backend-2:3000;
    server pong-reimagined-backend-3:3000;
}

server {

    location /socket.io/ {
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
        
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_pass http://loadbalancer;
        
        # Erhöht das Timeout für lange WebSocket-Verbindungen
        proxy_read_timeout 86400;
        proxy_send_timeout 86400;
    }

    location / {
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
        proxy_pass http://loadbalancer;
    }
}
```

## Erklärung

1. **Upstream Block**:
    - Der `upstream` Block definiert die Backend-Server, die den Traffic verarbeiten.
    - `ip_hash` stellt sicher, dass Anfragen von derselben IP-Adresse immer an denselben Backend-Server gesendet werden.
    - Die `server` Direktiven listen die Backend-Server auf.

2. **Server Block**:
    - Der `server` Block definiert die Regeln für eingehende Anfragen.
    - Der `location /socket.io/` Block behandelt WebSocket-Verbindungen und setzt die notwendigen Header für die Proxy-Verbindung.
    - Der `location /` Block leitet alle anderen Anfragen an den Loadbalancer weiter.

## Erweiterung der Clients

Um weitere Backend-Server hinzuzufügen, erweitern Sie einfach den `upstream` Block:

```nginx
upstream loadbalancer {
    ip_hash;
    server pong-reimagined-backend-1:3000;
    server pong-reimagined-backend-2:3000;
    server pong-reimagined-backend-3:3000;
    server pong-reimagined-backend-4:3000;  # Neuer Backend-Server
    server pong-reimagined-backend-5:3000;  # Neuer Backend-Server
}
```

Speichern Sie die Änderungen und starten Sie Nginx neu, um die neue Konfiguration zu laden:

```sh
docker compose up nginx --build
```

Damit ist Nginx als Loadbalancer konfiguriert und kann bei Bedarf um weitere Backend-Server erweitert werden.