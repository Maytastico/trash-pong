# Setze das Basis-Image aus dem Docker-Repository, um unsere App zu bauen. In diesem Fall möchten wir das Node-Image verwenden, um unsere Node-App auszuführen
FROM node:18.16.0-alpine as base

# Dann müssen wir unsere package.json und .env Datei in das Root-Verzeichnis des Images kopieren.
COPY package.json ./

# Dann müssen wir die Abhängigkeiten im Basis-Image installieren
RUN npm install

# Nach der Installation der Abhängigkeiten müssen wir den src-Ordner von unserer lokalen Datei in das Basis-Image kopieren
COPY source ./source

# Kopiere auch tsconfig.json in das Basis-Image
COPY tsconfig.json ./tsconfig.json

# Dann führen wir den Build-Befehl aus, dieser wird die ts-Dateien in JavaScript-Dateien kompilieren
RUN npm run build

# Nach der Verwendung des Basis-Images für den Build-Prozess können wir ein weiteres Image für den Produktions-Build erstellen
# Starte den Produktions-Image-Build, wir werden dasselbe Node-Image verwenden
FROM node:18.16.0-alpine

# Kopiere node_modules und das Build-Verzeichnis vom Basis-Image in das neue Image
COPY --from=base ./node_modules ./node_modules
COPY --from=base ./package.json ./package.json
COPY --from=base /dist /dist

# Öffne Port 3000 und startet die App.
EXPOSE 3000
CMD ["npm", "run", "start"]
