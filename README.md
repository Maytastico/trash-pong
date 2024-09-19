# Trash Pong

<img src="https://github.com/user-attachments/assets/905f6db1-34cd-4a85-bb24-5580d9cb03b7" alt="logo" width="300"/>


## Getting Started
### Server
Um den Pong Server zu Starten kann man im root-Verzeichnis folgenden Command Ausführen:
```bash
docker-compose up -d --build
```

Standardmäßg ist der Server über den Port 5000 erreichbar. 

### Spiel
Die Executables sind im Verzeichnis ```/game/export``` zu finden und sind für x86-64 Linux, Windows (und Mac - wahrscheinlich nicht) unterstützt. 
Mit Doppelklick können die Spiele dann gestartet werden.

#### Für Devs:
Sollte die Server URL und der Port vom Standard abweichen, können die Werte über Umgebungsvariablen verändert werden. 
Hier ein Beispiel auf einem Windows System:

1. Im Verzeichnis der Executable muss die Konsole geöffnet werden
2. In der Konsole müssen dann die Umgebungsvariablen gesetzt werden
   ```bash
   set PONG_SERVER_URL=http://localhost
   set PONG_SERVER_PORT=5000
   ```
3. In der selben Konsolen Session muss dann die Executable ausgeführt werden
   ```bash
   Pong.exe
   ```
4. Im Login-Menü wird zur Kontrolle auf der linken oberen Ecke die URL angezeigt


