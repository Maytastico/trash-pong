# pong-reimagined
## Definition of Done
* Alle zu der User-Story gehörenden Tasks müssen Geschlossen sein.
* Der Code muss die in der Userstory festgelegten Tasks erfüllen, und der Code muss vom Entwickler gründlich getestet worden sein.
* Alle bekannten Bugs müssen behoben worden sein.
* Code wurde von mindestens einer anderen Person überprüft
* Alle Branches die zu der Userstory gehören müssen zum Sprintende in den Mainbranch gemergt worden sein.
* Der Code muss ausreichend kommentiert sein.
## Codeanforderungen
* Der Code muss die in den Tasks beschriebenen Aufgaben erfüllen
* Die Namen von Variablen und Funktionen müssen sich an die JavaScript Naming Convention halten.
* Der Code sollte nie komplexer sein als benötigt, und sollte keine Redundanzen enthalten.
* Der Code muss auf Sicherheitslücken getestet werden.
* Der Code muss so kommentiert sein das er leicht verständlich ist.
## Board
https://tree.taiga.io/project/aronse1-verteiltes-pong/backlog

## Git Workflow
1. **Sprint-basierte Entwicklung:**
   - Für jeden Sprint wird eine eigene Sprint-Branch erstellt.
   - Am Ende jedes Sprints wird der Sprint-Branch in den Master-Branch gemerged.

2. **Story-Branches:**
   - Jede Story erhält einen eigenen Branch, abgeleitet vom Sprint-Branch.
   - Die Benennung erfolgt nach dem Schema: `#id-name`.

3. **Commits:**
   - Sprache: Deutsch
   - Innerhalb der Story-Branches werden für jeden Task oder mehrere Tasks separate Commits durchgeführt.
   - Die Commit-Nachricht enthält die IDs der zugehörigen Tasks und den Namen der Änderung im Format: `#id_#id2_#id3-name`.

5. **Abschluss einer Story:**
   - Nach Abschluss einer Story wird der entsprechende Branch sowohl lokal als auch remote vom Entwickler gelöscht.

6. **Merge und Approvals:**
   - Vor dem Merge einer Story in den Sprint-Branch muss mindestens ein Approver die Änderungen genehmigen.


## Definition of done (Dod)

## Requirements
1. **Spieler-Registrierung und -Login:**
    - Benutzer müssen sich mit ihren Namen anmelden können, um am Spiel teilzunehmen. 
2. **Echtzeit-Multiplayer-Funktionalität:**
    - Das Spiel muss in der Lage sein, mehrere Spieler in Echtzeit zu verbinden und ein synchronisiertes Spiel zu ermöglichen. Die Bewegungen der Schläger und der Ball müssen in Echtzeit zwischen den Spielern synchronisiert werden.
3. **Punkteverwaltung:**
    - Das System muss die Punkte der Spieler während des Spiels erfassen und verwalten können. Nach jedem Spiel sollte ein Punktestand angezeigt werden, der den Gewinner ermittelt.

### Functional Requirements

### Non functional Requirements
1. **Leistung und Skalierbarkeit:**
    - Das Spiel sollte auch bei hoher Benutzerzahl flüssig und ohne Verzögerungen laufen. Das System muss skalierbar sein, um eine große Anzahl von gleichzeitigen Spielern zu unterstützen.
2. **Sicherheit:**
    - Die Benutzerdaten, einschließlich Anmeldedaten und Spielstatistiken, müssen sicher gespeichert und übertragen werden. Das System sollte gegen häufige Sicherheitsbedrohungen wie SQL-Injektionen und Cross-Site-Scripting geschützt sein.
3. **Benutzerfreundlichkeit:**
    - Die Benutzeroberfläche des Spiels sollte intuitiv und leicht zu bedienen sein. Neue Spieler sollten sich schnell zurechtfinden und das Spiel ohne umfangreiche Anleitungen verstehen können.

## Releases
Die Releases erfolgen innerhalb der Sprintwechsel. Als Dokumentation dienen die Releasnotes innerhalb der Git-Releases.

