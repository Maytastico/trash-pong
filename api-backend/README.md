
## Installation

Um die Anwendung zum ersten Mal auszuführen, folgen Sie bitte diesen Schritten:

1. **Node.js installieren**:

    **Auf Ubuntu**:
    ```bash
    sudo apt update
    sudo apt install nodejs npm
    ```

    **Auf Windows**:
    1. Laden Sie den Node.js-Installer von der [offiziellen Website](https://nodejs.org/) herunter.
    2. Führen Sie den Installer aus und folgen Sie den Anweisungen auf dem Bildschirm.
    3. Überprüfen Sie die Installation, indem Sie die Eingabeaufforderung öffnen und die folgenden Befehle ausführen:
    ```cmd
    node -v
    npm -v
    ```

2. **Abhängigkeiten installieren**:
    Stellen Sie sicher, dass Sie Node.js und npm installiert haben. Installieren Sie dann die notwendigen Abhängigkeiten:
    ```bash
    npm install
    ```

3. **Umgebungsvariablen konfigurieren** (optional):
    Erstellen Sie eine `.env`-Datei im Stammverzeichnis des Projekts und fügen Sie die erforderlichen Umgebungsvariablen hinzu. Ein Beispiel könnte so aussehen:
    ```yml
    PGUSER=testuser 
    PGPASSWORD=SicheresPasswort! 
    PGDATABASE=pong_daten
    ```
    Innerhalb der package.json sind alle Umbungsvariablen für die Standard Anwendung konfiguriert, sodass ein einfacher
    Einstieg möglich ist.

    Möglicherweise muss ein JWT Secret Token erstellt werden. Folge dafür der JWT Secret Anleitung!

4. **Datenbank einrichten**:
    Stellen Sie sicher, dass Ihre Datenbank läuft und korrekt konfiguriert ist. Führen Sie ggf. Migrationen oder Seed-Skripte aus, um die Datenbank zu initialisieren.

    Die Datenbank kann auch über die docker compose Datei gestartet werden.
    Führe dafür ``docker compose up db --build`` aus.

    Docker übernimmt die Migration und Erstellung des Datenbankschemas 

5. **Anwendung starten**:
    Starten Sie die Anwendung mit dem folgenden Befehl:
    ```bash
    npm start
    ```
    Für die Entwicklungsanwendung kann über
    ```bash
    npm run dev
    ```
    gestartet werden. Dabei wird nodemon gestartet, welches nach der Änderung einer Datei ein
    Reload durchführt.

6. **Anwendung testen**:
    Öffnen Sie Ihren Browser und navigieren Sie zu `http://localhost:3000`, um sicherzustellen, dass die Anwendung ordnungsgemäß läuft.

## JWT Secret

1. Erstelle in dem Ordner ``source/auth`` die Datei token.ts

2. Erstelle dir einen key, indem du in der Konsole ``node`` aufrufst

3. Führe folgendes Kommando aus
```js
> require('crypto').randomBytes(64).toString('hex')
```

4. Du bekommst dann deinen Secret key
 '09f26e402586e2faa8da4c98a35f1b20d6b033c6097befa8be3486a829587fe2f90a832bd3ff9d42710a4da095a2ce285b009f0c3730cd9b8e1af3eb84df6611'

5. Schreibe folgenden String in die Datei ``source/auth/token.ts``
```js
export const SECRET_KEY:string = "<Key>";
```
Das könnte wie folt aussehen
```js
export const SECRET_KEY:string = "09f26e402586e2faa8da4c98a35f1b20d6b033c6097befa8be3486a829587fe2f90a832bd3ff9d42710a4da095a2ce285b009f0c3730cd9b8e1af3eb84df6611";
```

# Routen

#### Health Endpunkte

- **`GET /ping`**: Testet die Verbindung zur API.
    - **Antworten**:
        - `200`: Verbindung steht.
        - `500`: Fehler bei der Verbindung.

- **`GET /db`**: Überprüft die Verbindung zur Datenbank.
    - **Antworten**:
        - `200`: Verbindung zur Datenbank erfolgreich.
        - `500`: Fehler bei der Verbindung.

#### API Endpunkte

- **`GET /room`**: Gibt alle Räume aus.
    - **Sicherheit**: Bearer Token erforderlich.
    - **Antworten**:
        - `200`: Alle Räume werden ausgegeben.
        - `401`: Keine Authentifizierung.

- **`GET /room/{id}`**: Fragt einen speziellen Raum ab.
    - **Parameter**:
        - `id` (Pfadparameter): Die ID des Raums.
    - **Sicherheit**: Bearer Token erforderlich.
    - **Antworten**:
        - `200`: Raum wird zurückgegeben.
        - `404`: Raum existiert nicht.
        - `500`: API Fehler.

#### Nutzer Endpunkte

- **`POST /user/login`**: Fügt einen neuen Temperaturwert hinzu.
    - **Anfragekörper**:
        - `username` (Pflichtfeld): Der Benutzername.
    - **Antworten**:
        - `200`: Anmeldung erfolgreich.
        - `400`: Falscher Input.
        - `500`: Interner Fehler.

### Sicherheit

Die API verwendet Bearer Token für die Authentifizierung. Stellen Sie sicher, dass Sie ein gültiges JWT-Token in den Header Ihrer Anfragen einfügen.

### Beispielanfrage

```bash
curl -X GET "http://localhost:3000/room" -H "Authorization: Bearer <Ihr-Token>"
```

 
