extends Control
# Szenen Nodes
@onready var createRoomRequest = $CreateRoom                                  # POST Request um einen Raum in der Datenbank anzulegen
@onready var RoomnameObject = $RoomNameLabel/Roomname                         # Raumnamen Textbox
@onready var PasswordLabel = $PasswordLabel/Password                          # Passwort Textbox
@onready var requirePasswordObject = $RequirePassword                         # Passwort Checkbutton
@onready var getRoom = $GetAllSeRooms                                         # Request um einen Raum aus der Datenbank zu bekommen (Name ist bisschen irreführend)
@onready var click_sound = $Click                                             # Click Sound 

# Vorgeschlagener Raumname (Username + Room)
func _ready():
	RoomnameObject.text = Global.username + "'s Room"
	
# Cancel Knopf
# Die Create Room Instanz wird gelöscht und die Raumliste wird
# wieder angezeigt
func _on_cancel_button_pressed():
	var root = get_tree().get_root()
	root.remove_child(self)
	self.queue_free()
	for child in root.get_children():
		if child is Control:
			child.show()


# Create Button
# Anhand der Eingaben des Users wird ein Raum in der Datenbank angelegt (SQL INJECTIONS YAAAAAAY)
func _on_create_button_pressed():
	click_sound.play()
	var Roomname = RoomnameObject.text                                          # Text aus Inputfeld wird extrahiert
	var needsPassword = !requirePasswordObject.button_pressed                   # Schauen ob der Check<button gedrückt ist
	var password = PasswordLabel.text                                           # Passwort aus dem Inputfeld wird extrahiert
	if(needsPassword):                                                          # Wenn öffentlich, wird passwort genullt
		password = null;
	var jsonObject = {                                                          # Payload an den Server
		"title" : Roomname,
		"pw" : password,
		"oeffentlich" : needsPassword
	}
	var json_string =  JSON.new().stringify(jsonObject)
	var url = Global.apiURL + "/api/room"                                       # POST Route an Raum erstellt neuen Raum
	var token = Global.jwtToken                                                 # Authentifizierung
	var headers = [
	"Authorization: Bearer %s" % token,
	"Content-Type: application/json"
	]
	createRoomRequest.request(url, headers, HTTPClient.METHOD_POST, json_string) # Request mit Payload wird verschickt, bei erfolg -->  _on_create_room_request_completed()


# Wird gerufen wenn der Create Room Request fertig ist
func _on_create_room_request_completed(result, response_code, headers, body):
	if(response_code == 201):                                                       # Raum wurde erstellt
		var body_str = body.get_string_from_utf8()                                  # Im Body steht die Raum ID
		#print(body_str)
		var json = JSON.new()                                                       # Wird extrahiert
		var parse_result = json.parse(body_str)
		if parse_result == OK:
			var data = json.get_data()
			Global.activeRoomID = data[0].get("raum_id", -1)                        # active Raum ID wird Global gemacht um immer drauf zugreifen zu können 
			SetActiveRoom()                                                         # Activer Raum wird gesetzt


# Um den Aktiven Raum zu setzen werden die Daten nochmal frisch vom Server geholt
# Hierfür wird ein neuer Request auf den gerade erstellten Raun genacht
func SetActiveRoom():
	var url = Global.apiURL + "/api/room/" + str(Global.activeRoomID)
	var token = Global.jwtToken
	var headers = ["Authorization: Bearer %s" % token]
	getRoom.request(url, headers, HTTPClient.METHOD_GET)                           # GET Request auf den neu erstellten Raum, bei erfolg --> _on_get_all_se_rooms_request_completed



# Die Funktion wird gerufen wenn der Request geklappt hat (Name ist irrefühernd, war copy & paste)
func _on_get_all_se_rooms_request_completed(result, response_code, headers, body):
	if response_code == 200:                                                      # Raum ist tatsächlich in der Datenbank
		var body_str = body.get_string_from_utf8()                                # Im Body sind die Daten des Raums als Json
		var json = JSON.new()                                                     # Und werden geparsed
		var parse_result = json.parse(body_str)                                  
		if parse_result == OK:                                                    # Parse hat geklappt
			var data = json.get_data()
			SetRoom(data)                                                         # Daten werden extrahiert und in eine Raum Instanz geschrieben
			var imraum = load("res://im_raum.tscn").instantiate()                 # Raum-Lobby wird geladen
			get_tree().get_root().add_child(imraum)                               # An den Baum angehängt
			self.queue_free()                                                     # Und die Create-Room instanz wird gelöscht und nicht nur versteckt (bei neuer Runde entstehen sonst Bugs)

# Die Funktion extrahiert das JSON und schreibt
# die Daten in eine neue Raum Instanz
# Am Ende wird der Raum als Globale Variable gesetzt
# Um von überall drauf zugreifen zu können
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


func _on_cancel_button_button_down():
	click_sound.play()
