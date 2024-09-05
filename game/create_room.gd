extends Control


@onready var validateSessionRequest = $ValidateSession
@onready var createRoomRequest = $CreateRoom
@onready var RoomnameObject = $RoomNameLabel/Roomname
@onready var PasswordLabel = $PasswordLabel/Password
@onready var requirePasswordObject = $RequirePassword
@onready var getRoom = $GetAllSeRooms


# Called when the node enters the scene tree for the first time.
func _ready():
	RoomnameObject.text = Global.username + "'s Room"
	pass # Replace with function body.


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	pass


func _on_cancel_button_pressed():
	var root = get_tree().get_root()
	root.remove_child(self)

	self.queue_free()
	
	for child in root.get_children():
		if child is Control:
			child.show()



func _on_create_button_pressed():
	var Roomname = RoomnameObject.text
	var needsPassword = !requirePasswordObject.button_pressed
	var password = PasswordLabel.text
	if(needsPassword):
		password = null;
	var jsonObject = {
		"title" : Roomname,
		"pw" : password,
		"oeffentlich" : needsPassword
	}
	var json_string =  JSON.new().stringify(jsonObject)
	var url = Global.apiURL + "/api/room"
	var token = Global.jwtToken
	var headers = [
	"Authorization: Bearer %s" % token,
	"Content-Type: application/json"
	]
	createRoomRequest.request(url, headers, HTTPClient.METHOD_POST, json_string)



func _on_create_room_request_completed(result, response_code, headers, body):
	print(str(response_code))
	if(response_code == 201):
		var body_str = body.get_string_from_utf8()
		print(body_str)
		var json = JSON.new()
		var parse_result = json.parse(body_str)
		if parse_result == OK:
			var data = json.get_data()
			Global.activeRoomID = data[0].get("raum_id", -1)
			SetActiveRoom()
			
			

func SetActiveRoom():
	var url = Global.apiURL + "/api/room/" + str(Global.activeRoomID)
	print(url)
	var token = Global.jwtToken
	var headers = ["Authorization: Bearer %s" % token]
	getRoom.request(url, headers, HTTPClient.METHOD_GET)
		


func _on_get_all_se_rooms_request_completed(result, response_code, headers, body):
	if response_code == 200:
		var body_str = body.get_string_from_utf8()
		var json = JSON.new()
		var parse_result = json.parse(body_str)
		if parse_result == OK:
			var data = json.get_data()
			SetRoom(data)
			var imraum = load("res://im_raum.tscn").instantiate()
			get_tree().get_root().add_child(imraum)
			hide()

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




