-- Löschen der Tabelle 'raum', falls sie existiert
DROP TABLE IF EXISTS raum;

-- Löschen der Tabelle 'user', falls sie existiert
DROP TABLE IF EXISTS "user";


-- Erstellen der Tabelle 'user'
CREATE TABLE "user" (
    user_id SERIAL PRIMARY KEY,
    name character varying(255) NOT NULL UNIQUE,
    punktestand integer DEFAULT 0 NOT NULL,
    token VARCHAR(255) UNIQUE
);

-- Erstellen der Tabelle 'raum'
CREATE TABLE raum (
    raum_id SERIAL PRIMARY KEY,
    user_id1 integer NOT NULL,
    user_id2 integer NOT NULL,
    öffentlich boolean NOT NULL,
    passwort character varying(255),
    titel character varying(255) NOT NULL,
    FOREIGN KEY (user_id1) REFERENCES "user"(user_id),
    FOREIGN KEY (user_id2) REFERENCES "user"(user_id)
);

-- Einfügen von Daten in die Tabelle 'user'
INSERT INTO "user" (name, punktestand) VALUES
('PlayerOne', 150),
('GamerGirl', 200),
('ProGamer', 250),
('CasualJoe', 100),
('EliteSniper', 300);

-- Einfügen von Daten in die Tabelle 'raum'
INSERT INTO "raum" (user_id1, user_id2, öffentlich, passwort, titel) VALUES
(1, 2, TRUE, NULL, 'Open Room 1'),
(3, 4, TRUE, 'publicSecret', 'Open Room 2'),
(5, 1, FALSE, NULL, 'Private Room 1'),
(2, 3, FALSE, 'privatePass', 'Private Room 2'),
(4, 5, TRUE, NULL, 'Open Room 3'),
(1, 3, FALSE, NULL, 'Private Room 3'),
(2, 5, TRUE, 'openSesame', 'Open Room 4'),
(3, 1, FALSE, 'hiddenGem', 'Private Room 4');
