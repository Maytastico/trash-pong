# Trash Pong
<img src="https://github.com/user-attachments/assets/905f6db1-34cd-4a85-bb24-5580d9cb03b7" alt="logo" width="300"/>

Trashpong ist eine moderne Neuinterpretation des klassischen Pong-Spiels, das auf einer Client-Server-Architektur basiert. Der Server ist in Node.js implementiert und verwendet eine PostgreSQL-Datenbank zur Speicherung von Spielerdaten und Spielständen. Die Kommunikation zwischen Client und Server erfolgt über eine REST API und Websockets, um Echtzeit-Interaktionen zu ermöglichen.

### Technische Details

- **Server**: Der Server läuft in einer Docker-Umgebung und ist über Port 4000 erreichbar. Er bietet Endpunkte für die Benutzerverwaltung und Spielraumverwaltung.
- **Datenbank**: PostgreSQL wird als Datenbank verwendet, wobei die Verbindung über Umgebungsvariablen konfiguriert wird.
- **Client**: Der Client ist eine eigenständige Anwendung, die für x86-64 Linux und Windows kompiliert ist. Er kommuniziert mit dem Server über HTTP und Websockets.
- **Umgebungsvariablen**: Sowohl der Server als auch der Client verwenden Umgebungsvariablen zur Konfiguration, was eine flexible Anpassung an verschiedene Umgebungen ermöglicht.

Trashpong bietet eine robuste und skalierbare Plattform für Multiplayer-Pong-Spiele, die sowohl lokal als auch über das Internet gespielt werden kann.

## Getting Started
### Server

Standardmäßig sind keine Credentials im Repository. Dafür muss eine `.env` Datei erstellt werden.
In dieser müssen folgende Umgebungsvariablen definiert werden:

```bash
PGHOST=db
PGUSER=testuser
PGPASSWORD=SicheresPasswort!
PGDATABASE=pong_daten
POSTGRES_USER=testuser
POSTGRES_PASSWORD=SicheresPasswort!
POSTGRES_DB=pong_daten
```

Alle Umgebungsvariablen des Node Servers fangen mit `POSTGRES` an. Alle Umgebungsvariablen mit `PG` sind Variablen 
der Postgres-Datenbank. `PGHOST` muss `db`, `PGUSER` muss `testuser` und `PGDATABASE` muss `pong_daten` beinhalten.
Das einzige Feld, das variieren kann, ist das Passwort-Feld.


### JWT Secret

Anschließend muss in `/api-backend/source/auth` eine Token-Datei erstellt werden, welche im folgenden Format abgelegt werden muss. 

1. Erstelle in dem Ordner `/api-backend/source/auth` die Datei `token.ts`.

2. Erstelle dir einen Key, indem du in der Konsole `node` aufrufst.

3. Führe folgendes Kommando aus:
```js
> require('crypto').randomBytes(64).toString('hex')
```

4. Du bekommst dann deinen Secret Key:
 '09f26e402586e2faa8da4c98a35f1b20d6b033c6097befa8be3486a829587fe2f90a832bd3ff9d42710a4da095a2ce285b009f0c3730cd9b8e1af3eb84df6611'

5. Schreibe folgenden String in die Datei `source/auth/token.ts`:
```js
export const SECRET_KEY:string = "<Key>";
```
Das könnte wie folgt aussehen

> Sie können zu Testzwecken den unteren Key verwenden. Bitte generiere in einer produktiven Umgebung einen separaten Key!

```js
export const SECRET_KEY:string = "09f26e402586e2faa8da4c98a35f1b20d6b033c6097befa8be3486a829587fe2f90a832bd3ff9d42710a4da095a2ce285b009f0c3730cd9b8e1af3eb84df6611";
```

Anschließend kann der Pong-Server gestartet werden.
Dazu muss im Root-Verzeichnis folgender Befehl ausgeführt werden:

```bash
docker-compose up -d --build
```
NOTE: Wir haben das deployment auf mehreren Systemen getestet. Auf manchen Systemen funktioniert der Scale in der Docker-Compose nicht. Hierfür muss der scale Punkt aus dem Docker Compose entfernt werden und den Container über folgenden Command gestartet werden:

```bash
docker-compose up -d --build --scale backend=3
```

Außerdem kann es passieren, dass Docker die Namen der Container verändert. Manchmal wird die Scale Nummer mit einem Bindestrich und manchmal mit einem Unterstrich gesetzt. Beim Start wirft NginX dann einen Fehler dass die Container nicht gefunden werden.
Um den Fehler zu beheben müssen dann in der nginx.conf die Containernamen angepasst werden. Diese befindet sich im Verzeichnis ```/nginx/```.
Das sieht normalerweise so aus:
```
upstream loadbalancer {
    ip_hash;
    server trash-pong-backend-1:3000 ;
    server trash-pong-backend-2:3000 ;
    server trash-pong-backend-3:3000 ;
}

```

Standardmäßig ist der Server über den Port 4000 erreichbar.
Der Server hat dabei zwei Komponenten: einmal die REST API sowie den Websocket, über den das Spiel gespielt werden kann.
Die API kann über `/api/room` oder `/api/user` aufgerufen werden.
Um darauf zugreifen zu können, muss sich der Nutzer anmelden. Dies kann über `/user/login` durchgeführt werden.
Dazu kann eine POST-Anfrage an den Server gestellt werden. Innerhalb des Bodys muss der Nutzername spezifiziert werden.
Dies sieht wie folgt aus: `{"username": "hans"}`.

### API Endpunkte
#### Health Endpunkte

- **`GET /health/ping`**: Testet die Verbindung zur API.
    - **Antworten**:
        - `200`: Verbindung steht.
        - `500`: Fehler bei der Verbindung.

- **`GET /health/db`**: Überprüft die Verbindung zur Datenbank.
    - **Antworten**:
        - `200`: Verbindung zur Datenbank erfolgreich.
        - `500`: Fehler bei der Verbindung.

#### API Endpunkte

- **`GET /api/room`**: Gibt alle Räume aus.
    - **Sicherheit**: Bearer Token erforderlich.
    - **Antworten**:
        - `200`: Alle Räume werden ausgegeben.
        - `401`: Keine Authentifizierung.

- **`GET /api/room/{id}`**: Fragt einen speziellen Raum ab.
    - **Parameter**:
        - `id` (Pfadparameter): Die ID des Raums.
    - **Sicherheit**: Bearer Token erforderlich.
    - **Antworten**:
        - `200`: Raum wird zurückgegeben.
        - `404`: Raum existiert nicht.
        - `500`: API Fehler.

#### Nutzer Endpunkte

- **`POST /user/login`**: Regestriert den Nutzer und gibt einen JWT Token zurück mitdem die anderen Routen verwendet werden können
    - **Anfragekörper**:
        - `username` (Pflichtfeld): Der Benutzername.
    - **Antworten**:
        - `200`: Anmeldung erfolgreich.
        - `400`: Falscher Input.
        - `500`: Interner Fehler.



### Spiel
Die Anwendung ist im Verzeichnis `/game/export` zu finden (IN DER ABGABE NICHT, das Spiel muss selber gebaut werden) und ist für x86-64 Linux und Windows kompiliert.
Mit einem Doppelklick kann das Spiel gestartet werden.

#### Für Devs:
Sollte die Server-URL und der Port vom Standard abweichen, können die Werte über Umgebungsvariablen verändert werden.
Hier ein Beispiel auf einem Windows-System:

1. Im Verzeichnis der Executable muss die Konsole geöffnet werden.
2. In der Konsole müssen dann die Umgebungsvariablen gesetzt werden:
    ```bash
    set PONG_SERVER_URL=http://localhost
    set PONG_SERVER_PORT=4000
    ```
    Für Linux müssen die Variablen über den export Befehl gesetzt werden:
    ```bash
    export PONG_SERVER_URL=http://localhost
    export PONG_SERVER_PORT=4000
    ```
3. In derselben Konsolen-Session muss dann die Executable ausgeführt werden:
    ```bash
    Pong.exe
    ```
    Für Linux müssen die Variablen über den export Befehl gesetzt werden:
    Die Datei pong.x86_64 muss Rechte für die Ausführung haben.
    ```bash
    chmod g+x pong.x86_64
    bash pong.sh
    ```
4. Im Login-Menü wird zur Kontrolle in der linken oberen Ecke die URL angezeigt.

#### Build it yourself
Um das Spiel bauen zu können wird die Godot Engine benötigt. Diese kann hier: https://godotengine.org/download/ heruntergeladen werden.
Nach dem Download kann dann über die Godot Engine die ```project.godot``` Datei im ```/game``` Verzeichnis geöffnet werden. 

Skripte befinden sich im ```/game/logic``` Verzeichnis. Dort ist unter anderem die ```GLOBALS.gd```, welche alle globalen Variablen enthält. Hier kann unter anderem auch die Server URL und der Port verändert werden.

