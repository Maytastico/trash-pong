extends Control
# Die meiste Speil Logik wird über den Socket hier im Raum gesteuert
# Das Pong Spiel ist ein Child von dem Raum und kann somit
# einfach über den Raum gesteuert werden
# Da der Socket Verbindung im Raum aufgemacht wird befindet sich die Socket Logik im Raum
# und nicht im Pong Spiel an sich 

# Scene Nodes
@onready var CreatorLabel = $CreatorLabel                                       # Name von Spieler 1
@onready var JoinerLabel = $JoinedLabel                                         # Name von Spieler 2
@onready var RaumLabel = $Raumname                                              # Name des Raums
@onready var NumberOfPlayers = $NumberOfPlayers                                 # Anzahl der Spieler
@onready var getRoomRequest = $GetRoom                                          # GET Request um einen Raum zu bekommen
@onready var click_sound = $Click                                               # Click Sound
var paddle_left                                                                 # Paddle von Spieler 1 (aus dem Pong Node)
var paddle_right                                                                # Paddle von Spieler 2 (aus dem Pong Node)
var ball                                                                        # Der Spiel Ball (aus dem Pong Node)
var pong = null                                                                 # Pong Node

# Beim ersten Joinen des Raums wird eine Socket IO Verbindung aufgemacht
# Außerdem werden die Callback Funktionen für einkommende Nachrichten 
# registriert
func _ready():
	Global.client = SocketIOClient.new(Global.apiURL + "/socket.io", {"token": Global.jwtToken} )
	Global.client.on_engine_connected.connect(on_socket_ready)
	Global.client.on_connect.connect(on_socket_connect)
	Global.client.on_event.connect(on_socket_event)
	add_child(Global.client)
	self.hide()                                                             # Zu beginn wir die Szene versteckt, bis die Verindung steht




# Die Funktion wird gecallt sobald die Verbindung zum SocketIO
# Server besteht
func on_socket_connect(_payload: Variant, _name_space, error: bool):
	# Wenn ein Fehler auftritt wird die jetzige Szene gelöscht
	# und man kommt zurück zur Lobby
	if error:
		goLobby()
	# Ansonsten wird eine Anfrage an den Server gestellt
	# um den Room (Websocket) beizutreten
	else:
		var packet = {"roomId" : Global.activeRoom.raum_id, "playerId" : 3}
		Global.client.socketio_send("joinRoom", packet)
		UpdateRoom(Global.activeRoom.raum_id)                       # Inhalt vom Raum wird aktualisiert
		self.show()                                                 # Szene wird angezeigt

# Sobald der Client initialisiert ist
# wird eine Verbindung aufgemacht
func on_socket_ready(_sid: String):
	Global.client.socketio_connect()

# MAIN Funktion des Spiels. Hier werden eingehende Nachrichten
# Ausgewertet und anhand der Events wird das Spiel gesteuert
func on_socket_event(event_name: String, payload: Variant, _name_space):
	# Die Notification ist beispielsweise wenn ein Spieler beitritt, in dem Fall 
	# muss vom Server der Raum neu geholt werden und die Anzeigen aktualisiert werden
	if event_name == "notification":
		UpdateRoom(Global.activeRoom.raum_id)
	# Wenn das Event kommt hat ein Spieler das Spiel gestartet
	# Die Pong instanz wird geladen und die Knoten aus dem Spiel werden
	# registriert um die Spiel Logik hier zu steuern
	elif event_name == "starting_game":
			Global.roomToken = getRoomToken(str(payload))                # Room Token wird als Globale Variable gesetzt um von überall darauf zugreifen zu können
			pong = load("res://pong.tscn").instantiate()
			get_tree().get_root().add_child(pong)
			paddle_left = pong.get_node("Player1") 
			paddle_right = pong.get_node("Player2")  
			ball = pong.get_node("Ball")
			hide()
	# Das Event updatet das Paddle des Gegners
	elif event_name == "update_paddle":
		if payload.username != Global.username:                                 # Im Payload muss der Username vorhanden sein um zuzuordnen welche Paddle bewegt werden muss
			# Nur der Paddle des Gegners muss aktualisiert werden
			if Global.activeRoom.player1 == payload.username and paddle_left:                       
				paddle_left.set_pos_and_motion(Vector2(payload.position_x, payload.position_y), payload.motion)
			elif Global.activeRoom.player2 == payload.username and paddle_right:
				paddle_right.set_pos_and_motion(Vector2(payload.position_x, payload.position_y), payload.motion)
	# Kommt das Event wird der Ball gebounced
	elif event_name == "bounce":
		ball.bounce(payload.left, payload.random)
	# Bei einem Tor wird der Ball zurückgesetzt 
	# Und der Score wird aktualisisert
	elif event_name == "goal":
		ball._reset_ball(payload.left)
		pong.update_score(payload.left)
	# Sobald ein Spieler die Verbindung verliert
	# oder das Spiel  beendet wird man zurück in die Raumliste geworfen
	# (Das passiert auch im Raum, auch wenn das Spiel noch nicht gestartet wurde)
	elif event_name == "disconnected":
		getBackToLobby()
	# Sobald ein Spieler 10 Punkte erreicht hat, wird das Event gefeuert
	# Der Ball wird gestoppt und es wird 5 Sekunden gewartet
	# beor man zur Lobby geht (ist sonst zu plötzlich)
	elif event_name == "end":
		ball.stop()
		await _sleep(5)
		getBackToLobby()
	# 10/10 Error Handling wieder
	elif  event_name == "error":
		print(payload)

# Leave Button
func _on_leave_button_pressed():
	goLobby()

# Eigene Sleep Funktion weil godot keine hat
func _sleep(time : int):
	var timer = Timer.new()
	timer.wait_time = time 
	timer.one_shot = true  
	add_child(timer)
	timer.start()
	await timer.timeout
	timer.queue_free()

# Hilfsfunktion um die Anzeige der Anzahl der Spieler aktualiseren zu können
func ChangeNumberOfPlayers():
	var number
	if(Global.activeRoom.player2 == ""):
		number = 1
	else:
		number = 2
	NumberOfPlayers.text = str(number)+ "/2"
	
# Hilfsfunktion um die Anzeigen zu Steuern
func SetRoomProperties():
		CreatorLabel.text = Global.activeRoom.player1
		JoinerLabel.text = Global.activeRoom.player2
		RaumLabel.text = Global.activeRoom.title
		ChangeNumberOfPlayers()

# Funktion sendet einen HTTP-GET-Request an die Datenbank um den aktiven
# Raum zu aktualisieren. Bei erfolg --> _on_get_room_request_completed()
func UpdateRoom(roomID : int):
	var url = Global.apiURL + "/api/room/" + str(roomID)
	var token = Global.jwtToken
	var headers = ["Authorization: Bearer %s" % token]
	getRoomRequest.request(url, headers, HTTPClient.METHOD_GET)


# Wenn der Request erfolgreich war wird der Raum aus Payload extrahiert
# und der aktive Raum wird aktualisiert
# Als letztes werden dann noch die Anzeigen aktualisiert
func _on_get_room_request_completed(result, response_code, headers, body):
	var body_str = body.get_string_from_utf8()
	var json = JSON.new()
	var parse_result = json.parse(body_str)
	if parse_result == OK:
		var data = json.get_data()
		SetRoom(data)
		SetRoomProperties()

# JSON wird in eine Neue Raum Instanz geschrieben
# Dann wird der aktive Raum aktualisiert
func SetRoom(data):
	var room = preload("res://logic/Rooms.gd").new()
	room.raum_id = data.get("raum_id", 0)
	room.spieler_id_1 = data.get("user_id1", 0)
	var spieler2_id = data.get("user_id2", 0)
	if(spieler2_id == null):
		room.spieler_id_2 = ""
	room.public = data.get("öffentlich", true)
	var pw = data.get("passwort", "")
	if(pw == null):
		room.password = ""
	else:
		room.password = pw
	room.title = data.get("titel", "Rooom")
	room.player1 = data.get("user1", "Player1")
	var player2 = data.get("user2", "Player2")
	if(player2 ==null):
		room.player2 = ""
	else:
		room.player2 = player2
	Global.activeRoom = room

# Wenn eine Person Start drückt wird das 'startPressed' Event an den Server geschickt
func _on_start_button_pressed():
	click_sound.play()
	if Global.activeRoom.player2 == "":
		return
	var payload = {"raum_id" : Global.activeRoom.raum_id}
	var json_string =  JSON.new().stringify(payload)
	Global.client.socketio_send("startPressed", json_string)
	 

# Hilsfunktion um den Room Token aus dem JSON zu extrahieren
func getRoomToken(data):
	var json = JSON.new()
	var parse_result = json.parse(data)
	if parse_result == OK:
		var jsonObject = json.get_data()
		var token = jsonObject.get("room_token", "")
		return token
	else:
		return ""
		

# Funktion um zur Raumliste zurück zukommen
func getBackToLobby():
	if pong:                          # Wenn eine Pong Instanz da ist
		pong.queue_free()             # Wird diese zerstört
		pong = null  
	goLobby()                         # Und es geht zurück zur RaumListe

# Funktion zerstört die im_raum Instanz (momentane Instanz), findet die RaumListe im Baum und zeigt diese wieder an
func goLobby():
	var root = get_tree().get_root()
	root.remove_child(self)
	Global.client.socketio_disconnect()
	self.queue_free()
	for child in root.get_children():
		if child is Control:
			if child.name == "Raumliste":
				child.show()


func _on_leave_button_button_down():
	click_sound.play()
