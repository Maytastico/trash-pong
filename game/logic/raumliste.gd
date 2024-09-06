extends Control

@onready var allSeRoomsRequest = %GetAllSeRooms
@onready var RaumListe = $ItemList
@onready var RefrshButton = $Refresh
@onready var PasswordPanel = $EnterPasswordPanel
@onready var PasswordTextBox = $EnterPasswordPanel/EnterPasswordLabel/InputPassword
# Called when the node enters the scene tree for the first time.
func _ready():
	RefrshButton.disabled = true
	var url = Global.apiURL + "/api/room"
	var token = Global.jwtToken
	var headers = ["Authorization: Bearer %s" % token]
	allSeRoomsRequest.request(url, headers, HTTPClient.METHOD_GET)


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	pass

		
func _on_join_room_pressed():
	var selected_items = RaumListe.get_selected_items()
	if(selected_items.size() <= 0):
		return
	else:
		Global.activeRoomID = Global.rooms[selected_items[0]].raum_id
		Global.activeRoom = Global.rooms[selected_items[0]]
		if(!checkForPassword(selected_items[0])):
			var imraum = load("res://im_raum.tscn").instantiate()
			get_tree().get_root().add_child(imraum)
			hide()




func checkForPassword(roomID : int):
	if(!Global.rooms[roomID].public):
		PasswordPanel.show()
		return true
	return false

func _on_create_room_pressed():
	var createroom = load("res://create_room.tscn").instantiate()
	get_tree().get_root().add_child(createroom)
	hide()



func _on_get_all_se_rooms_request_completed(result, response_code, headers, body):
	if response_code == 200:
		var body_str = body.get_string_from_utf8()
		var json = JSON.new()
		var parse_result = json.parse(body_str)
		if parse_result == OK:
			var data = json.get_data()
			fill_room_array(data)
			#printAllRooms()
			fillRoomList()
	else:
		print("error")
	RefrshButton.disabled = false
		

func fill_room_array(data):
	Global.rooms.clear()
	for item in data:
		var room = preload("res://logic/Rooms.gd").new()
		room.raum_id = item.get("raum_id", 0)
		room.spieler_id_1 = item.get("user_id1", 0)
		var spieler2_id = item.get("user_id2", 0)
		if(spieler2_id == null):
			room.spieler_id_2 = ""
		room.public = item.get("öffentlich", true)
		var pw = item.get("passwort", "")
		if(pw == null):
			room.password = ""
		else:
			room.password = pw
		room.title = item.get("titel", "Rooom")
		room.player1 = item.get("user1", "Player1")
		var player2 = item.get("user2", "Player2")
		if(player2 ==null):
			room.player2 = ""
		else:
			room.player2 = player2
		Global.rooms.append(room)
		

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
	RaumListe.clear()
	var titlewidth = 45
	var playercountwidth = 60
	var creatorwitdh = 20
	var locked_icon = load("res://ressources/lock.png")
	var unlocked_icon = load("res://ressources/unlocked.png")
	for room in Global.rooms:
		var player_amount = 1
		if(room.player2 != ""):
			player_amount = 2
		var title = room.title.rpad(titlewidth)
		var player_count_text = ("%d/2" % [player_amount]).rpad(playercountwidth)
		var creator_text = room.player1.rpad(creatorwitdh)
		
		var ListItem = title + player_count_text + creator_text
		if(room.public):
			RaumListe.add_item(ListItem, unlocked_icon)
		else:
			RaumListe.add_item(ListItem, locked_icon)
		
	




func _on_refresh_pressed():
	RefrshButton.disabled = true
	var url = Global.apiURL + "/api/room"
	var token = Global.jwtToken
	var headers = ["Authorization: Bearer %s" % token]
	allSeRoomsRequest.request(url, headers, HTTPClient.METHOD_GET)





func _on_cancel_pressed():
	PasswordTextBox.text = ""
	PasswordPanel.hide()
	
