extends Control

# Szenen Nodes
@onready var allSeRoomsRequest = %GetAllSeRooms                                            # HTTP-Request um alle Räume aus der Datenbank abzufragen
@onready var RaumListe = $ItemList                                                         # Das Ding wo die Räume aufgelistet werden
@onready var RefrshButton = $Refresh                                                       # Knopf um Räume zu aktualisieren
@onready var PasswordPanel = $EnterPasswordPanel                                           # Das kleine Fenster welches Aufploppt wenn man ein Passwort eingeben muss
@onready var PasswordTextBox = $EnterPasswordPanel/EnterPasswordLabel/InputPassword        # Die Passwort-Textbox
@onready var click_sound = $Click                                                          # Klick Sound Node
# Funktion wird Aufgerufen wenn die Szene Startet
func _ready():
	_refresh_Rooms()
	self.connect("visibility_changed",_on_visibility_changed)                              # Signal dass sich die Räume aktualisieren wenn die Szene wieder gezeigt wird

# Funktion holt sich alle Räume aus der Datenbank
func _refresh_Rooms():
	RefrshButton.disabled = true                                                           # Refresh Knopf wird deaktiviert bis Request fertig ist um mehrere Requests zu vermeiden
	var url = Global.apiURL + "/api/room"                                                  # Room Route returnt JSON mit allen Räumen
	var token = Global.jwtToken
	var headers = ["Authorization: Bearer %s" % token]
	allSeRoomsRequest.request(url, headers, HTTPClient.METHOD_GET)                         # Request um Räume aus der Datenbank zu holen wird gestartet (bei erfolg -->  _on_get_all_se_rooms_request_completed())
	
	
# Join Button wurde gedrückt
# Funktion ist reentrant und es kommt höchstwahrscheinlich
# zu race conditions 
func _on_join_room_pressed():
	click_sound.play()                                                                    # Click Sound wird abgespielt
	var selected_items = RaumListe.get_selected_items()                                   # Der Raum welcher angeklickt wurde wird ausgewählt (Ist einfach eine Liste mit Index)
	if(selected_items.size() <= 0):                                                       # Es muss aus der Liste ein Raum ausgewählt sein, sonst passiert nichts
		return
	else:                                                                                 # Es wurde ein Raum ausgewählt (selected_items[0] ist der Index aus der Raumliste)
		Global.activeRoomID = Global.rooms[selected_items[0]].raum_id                     # Die Raum ID wird anhand des ausgewählten Raum gesetzt
		Global.activeRoom = Global.rooms[selected_items[0]]                               # Und der Raum an sich wird gespeichert
		if Global.activeRoom.player2 == "":                                               # Wenn im Raum noch Platz ist, ist der Name vom 2. Spieler leer, nur dann kann gejoint werden (keine echtzeitkontrolle, das führt safe zu race conditions)
			if(!checkForPassword(Global.activeRoom)):                                     # Wenn Passwortgeschützt, dann muss man Passwort eingeben
				var imraum = load("res://im_raum.tscn").instantiate()                     # Ansonsten wird der Raum (Szene) geladen
				get_tree().get_root().add_child(imraum)                                   # und dem Baum angehängt
				hide()                                                                    # Raumliste (jetzige Szene) wird nur versteckt (nach dem Spiel springt man zu ihr zurück)



# Passwort Kontrolle
func checkForPassword(activeRoom):
	if(!activeRoom.public):
		PasswordPanel.show()
		return true
	return false

# Create Button wurde gedrückt
func _on_create_room_pressed():
	click_sound.play()                                                                 # Klick sound wird abgespielt 
	var createroom = load("res://create_room.tscn").instantiate()                      # Create Room Szene wird geladen
	get_tree().get_root().add_child(createroom)                                        # und dem Baum angehängt
	hide()                                                                             # Raumliste (jetzige Szene) wird versteckt


# Funktion wird nach dem Request aufgerufen 
func _on_get_all_se_rooms_request_completed(result, response_code, headers, body):
	if response_code == 200:                                                          # Hat geklappt, Räume wurden abgerufen
		var body_str = body.get_string_from_utf8()                                    # Response wird in einen String gespeichert
		var json = JSON.new()
		var parse_result = json.parse(body_str)                                       # JSON wird geparsed
		if parse_result == OK:                                                        # Parsing hat geklappt
			var data = json.get_data()                                                # Daten werden zur weiter Verarbeitung extrahiert
			fill_room_array(data)                                                     # JSON Daten werden in ein Array gespeichert
			fillRoomList()                                                            # Die Liste zum Auswählen wird gefüllt
	else:                                                                             # Request hat nicht geklappt
		print("error")                                                                # 10/10 Error Handling
	RefrshButton.disabled = false                                                     # Nach dem Request wird der Button wieder freigegeben um erneut die Räume zu aktualisieren

# Die Funktion nimmt die JSON Daten und wandelt die 
# Daten in eine Raum Klasse um
func fill_room_array(data):
	Global.rooms.clear()                                                              # Inhalt des Arrays wird gelöscht
	for item in data:                                                                 # Es wird durch jeden eintrag der Response Iteriert
		var room = preload("res://logic/Rooms.gd").new()                              # Neue Raum Instanz wird angelegt
		room.raum_id = item.get("raum_id", 0)                                         # Raum ID wird extrahiert
		room.spieler_id_1 = item.get("user_id1", 0)                                   # ID von Spieler 1 wird extrahiert
		var spieler2_id = item.get("user_id2", 0)                                     # ID von Spieler 2 wird extrahiert
		if(spieler2_id == null):                                                      # Ist evtl. null weil noch kein weiterer gejoint ist
			room.spieler_id_2 = ""
		room.public = item.get("öffentlich", true)                                    # Öffentlich oder Privat
		var pw = item.get("passwort", "")
		if(pw == null):                                                               # Passwort ist Null wenn Öffentlich
			room.password = ""                                                        # Wenn null, dann leerer string (um abfragen auf die variable zu machen)
		else:
			room.password = pw                                                        # Ansonsten wird PW gesetzt
		room.title = item.get("titel", "Rooom")                                       # Raum Titel wird extrahiert 
		room.player1 = item.get("user1", "Player1")                                   # Name von Spieler 1 wird extrahiert
		var player2 = item.get("user2", "Player2")                                    # Name von Spieler 2 wird extrahiert
		if(player2 ==null):
			room.player2 = ""                                                         # Wenn null, dann leerer string (um abfragen auf die variable zu machen)
		else:
			room.player2 = player2
		Global.rooms.append(room)                                                     # Raum Instanz wird dem Array angehängt
		
# Debug Hilfsfunktion
func printAllRooms():
	for item in Global.rooms:
		print("RaumID: " + str(item.raum_id))
		print("SpielerID1: " + str(item.spieler_id_1))
		print("SpielerID2: " + str(item.spieler_id_2))
		print("Public: " + str(item.public))
		print("Password: " + item.password)
		print("Title: " + item.title)
		print("Player1: " + item.player1)
		print("Player2: " +item.player2)
		print("---------------------------------")



func fillRoomList():
	RaumListe.clear()                                                           # Inhalt der Liste wird gelöscht
	const titlewidth = 45                                                       # Da die Einträge alles Strings sind,
	const playercountwidth = 60                                                 # wird ein festes Padding festgelegt
	const creatorwitdh = 20                                                     # um sicherzustellen dass die Einträge richtig untereinander sind
	var locked_icon = load("res://ressources/lock.png")                         # Schlüsselbild für Räume mit Passwort
	var unlocked_icon = load("res://ressources/unlocked.png")                   # Leeres Bild für Räume ohne Passwort
	for room in Global.rooms:                                                   # Es wird durch jeden Raum iteriert
		var player_amount = 1                                                   # Standardmäßig ist nur einer im Raum
		if(room.player2 != ""):                                                 # Wenn 2. Name nicht leer ist, sind 2 leute drin
			player_amount = 2 
		var title = room.title.rpad(titlewidth)                                 # Title mit Padding wird angelegt
		var player_count_text = ("%d/2" % [player_amount]).rpad(playercountwidth) # Anzahl der Spieler mit Padding wird angelget
		var creator_text = room.player1.rpad(creatorwitdh)                      # Name des Creators wird mit Padding angelegt
		
		var ListItem = title + player_count_text + creator_text                 # Neues List Element (String) wird mit den 3 vorherigen Strings zusammengeführt 
		if(room.public):                                                        # An das List Element wird entweder das Schlüsselbild, oder das leere angehängt
			RaumListe.add_item(ListItem, unlocked_icon)                         
		else:
			RaumListe.add_item(ListItem, locked_icon)
		
	



# Refresh Knopf schickt eine HTTP-Get Anfrage an den Server
# Um eine Frische Liste der Räume zu erhalten
func _on_refresh_pressed():
	click_sound.play()
	_refresh_Rooms()




# Cancel Knopf des Passworteingabe Panels
# Das versteckt einfach das Fenster wieder
func _on_cancel_pressed():
	click_sound.play()
	PasswordTextBox.text = ""
	PasswordPanel.hide()
	

# Join Knopf des Passworteingabe Panels
# Gleicht die Passwörter ab und wenn es Stimmt
# Lädt man in den Raum rein
func _on_join_button_pressed():
	click_sound.play()
	if PasswordTextBox.text == Global.activeRoom.password:
		PasswordTextBox.text = ""
		PasswordPanel.hide()
		var imraum = load("res://im_raum.tscn").instantiate()
		get_tree().get_root().add_child(imraum)
		hide()
	 

# Exit-Knopf beendet das Spiel
func _on_exit_pressed():
	get_tree().quit()  

func _on_exit_button_down():
	click_sound.play()

# Wenn die RaumListe wieder geladen wird, werden die Räume automatisch aktualisiert
func _on_visibility_changed():
	if visible:
		_refresh_Rooms()




