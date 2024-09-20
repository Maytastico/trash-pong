
# Postgres

Datenbank aufsetzen in drei einfachen Schritten:
1. Den Ordner Daten und das docker-compose File in einen beliebigen Ordner kopieren.
2. Im Terminal zu dem ausgewählten Ordner navigieren. Docker compose up -d ausführen.
3. Der Container ist nun in Docker Desktop zu sehen. Nun kann man das Terminal der Datenbank aufrufen und sich mit psql -U testuser -d pong_daten anmelden. Nun kann man wie gewohnt SQL Statements in dem Terminal ausführen.

## Schema 

![ER-Modell](../../Doku/Abbildungen/ER-Modell.png)
Die Datenbank speichert Informationen über die Spielräume und die Spieler. Jeder Spieler kann mehrere Räume erstellen und ihnen beitreten, befindet sich mindesten eine Person in einem Raum zur gleichen Zeit. Das ER-Modell visualisiert die Beziehungen zwischen den Spielern und den Räumen.


## Datenbankschema erstellen

Um eigene Datenbankschemen zu erstellen, können die folgenden SQL-Befehle verwendet werden:

```sql
-- Löschen der Tabelle 'raum', falls sie existiert
DROP TABLE IF EXISTS raum;

-- Löschen der Tabelle 'user', falls sie existiert
DROP TABLE IF EXISTS "user";

-- Erstellen der Tabelle 'user'
CREATE TABLE "user" (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    punktestand INTEGER DEFAULT 0 NOT NULL,
    token VARCHAR(512) UNIQUE
);

-- Erstellen der Tabelle 'raum'
CREATE TABLE raum (
    raum_id SERIAL PRIMARY KEY,
    user_id1 INTEGER,
    user_id2 INTEGER,
    öffentlich BOOLEAN NOT NULL,
    passwort VARCHAR(255),
    titel VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id1) REFERENCES "user"(user_id) ON DELETE SET NULL,
    FOREIGN KEY (user_id2) REFERENCES "user"(user_id) ON DELETE SET NULL
);

-- Einfügen von Daten in die Tabelle 'user'
INSERT INTO "user" (name, punktestand) VALUES
('PlayerOne', 150),
('GamerGirl', 200),
('ProGamer', 250),
('CasualJoe', 100),
('EliteSniper', 300);

-- Einfügen von Daten in die Tabelle 'raum'
INSERT INTO raum (user_id1, user_id2, öffentlich, passwort, titel) VALUES
(1, 2, TRUE, NULL, 'Open Room 1'),
(3, 4, TRUE, 'publicSecret', 'Open Room 2'),
(5, 1, FALSE, NULL, 'Private Room 1'),
(2, 3, FALSE, 'privatePass', 'Private Room 2'),
(4, 5, TRUE, NULL, 'Open Room 3'),
(1, 3, FALSE, NULL, 'Private Room 3'),
(2, 5, TRUE, 'openSesame', 'Open Room 4'),
(2, NULL, TRUE, 'openSesame', 'Open Room 4'),
(3, 1, FALSE, 'hiddenGem', 'Private Room 4');
```

Das Datenbankschema kann auch in der Dockerfile angepasst werden, um beim Starten des Containers automatisch angewendet zu werden.