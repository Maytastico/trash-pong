// Importiere die socket.io-client Bibliothek
const { io } = require('socket.io-client');

// Verbinde dich mit dem Server (ersetze 'http://localhost:3000' durch die richtige URL)
const socket = io('http://localhost:3000');

// Wenn die Verbindung erfolgreich hergestellt wurde
socket.on('connect', () => {
    console.log(`Connected with id: ${socket.id}`);
    
    // Sende das 'joinRoom' Event
    socket.emit('joinRoom', {
        roomId: 'test-room',  // Ersetze mit deiner Raum-ID
        playerId: 'player1'   // Ersetze mit deiner Spieler-ID
    });

    // Überprüfe die aktuellen Räume (dies ist eine Custom-Funktion, kann aber hilfreich sein)
    socket.on('notification', (message) => {
        console.log('Notification received:', message);
    });

    // Sende eine Nachricht an den Raum
    socket.emit('sendMessage', {
        roomId: 'test-room',  // Ersetze mit deiner Raum-ID
        message: 'Hello, this is a test message!'
    });
});

// Wenn eine Nachricht vom Server empfangen wird
socket.on('joinRoom', (data) => {
    console.log('Message received:', data);
});

// Falls eine Verbindungstrennung stattfindet
socket.on('disconnect', () => {
    console.log('Disconnected from server');
});
