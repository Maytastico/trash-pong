# Setup
Setzte die Enviromentvariablen 

```yml
PGUSER=testuser 
PGPASSWORD=SicheresPasswort! 
PGDATABASE=pong_daten
```

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
 
