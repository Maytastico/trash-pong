extends Control

@onready var CreatorLabel = $CreatorLabel
@onready var JoinerLabel = $JoinedLabel
@onready var RaumLabel = $Raumname
@onready var NumberOfPlayers = $NumberOfPlayers
@onready var getRoomRequest = $GetRoom

var paddle_left
var paddle_right
# Called when the node enters the scene tree for the first time.
func _ready():
	Global.client = SocketIOClient.new(Global.apiURL + "/socket.io", {"token": Global.jwtToken} )
	Global.client.on_engine_connected.connect(on_socket_ready)
	Global.client.on_connect.connect(on_socket_connect)
	Global.client.on_event.connect(on_socket_event)
	add_child(Global.client)
	self.hide()



# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	pass

func on_socket_connect(_payload: Variant, _name_space, error: bool):
	if error:
		print("Error connecting to socket")
		print(_payload)
		print(_name_space)
		var root = get_tree().get_root()
		root.remove_child(self)
		Global.client.socketio_disconnect()
		self.queue_free()
		
		for child in root.get_children():
			if child is Control:
				if child.name == "CreateRoom":
					continue
				child.show()
	else:
		var packet = {"roomId" : Global.activeRoom.raum_id, "playerId" : 3}
		Global.client.socketio_send("joinRoom", packet)
		UpdateRoom(Global.activeRoom.raum_id)
		self.show()
		
func on_socket_ready(_sid: String):
	Global.client.socketio_connect()

func on_socket_event(event_name: String, payload: Variant, _name_space):
	print("Received ", event_name, " ", payload)
	if event_name == "notification":
		UpdateRoom(Global.activeRoom.raum_id)
	elif event_name == "starting_game":
			Global.roomToken = getRoomToken(str(payload))
			print(Global.roomToken)
			var imraum = load("res://pong.tscn").instantiate()
			get_tree().get_root().add_child(imraum)
			paddle_left = imraum.get_node("Player1") 
			paddle_right = imraum.get_node("Player2")  
			hide()
	elif event_name == "update_paddle":
		if payload.username != Global.username:
			if Global.activeRoom.player1 == payload.username and paddle_left:
				paddle_left.set_pos_and_motion(Vector2(payload.position.x, payload.position.y), payload.motion)
			elif Global.activeRoom.player2 == payload.username and paddle_right:
				paddle_right.set_pos_and_motion(Vector2(payload.position.x, payload.position.y), payload.motion)

func _on_leave_button_pressed():
	var root = get_tree().get_root()
	root.remove_child(self)
	Global.client.socketio_disconnect()
	self.queue_free()
	
	for child in root.get_children():
		if child is Control:
			if child.name == "CreateRoom":
				continue
			child.show()
			
			
func ChangeNumberOfPlayers():
	var number
	if(Global.activeRoom.player2 == ""):
		number = 1
	else:
		number = 2
	NumberOfPlayers.text = str(number)+ "/2"
	
	
func SetRoomProperties():
		CreatorLabel.text = Global.activeRoom.player1
		JoinerLabel.text = Global.activeRoom.player2
		RaumLabel.text = Global.activeRoom.title
		ChangeNumberOfPlayers()

func UpdateRoom(roomID : int):
	var url = Global.apiURL + "/api/room/" + str(roomID)
	var token = Global.jwtToken
	var headers = ["Authorization: Bearer %s" % token]
	getRoomRequest.request(url, headers, HTTPClient.METHOD_GET)



func _on_get_room_request_completed(result, response_code, headers, body):
	print(str(response_code))
	var room = preload("res://logic/Rooms.gd").new()
	var body_str = body.get_string_from_utf8()
	var json = JSON.new()
	var parse_result = json.parse(body_str)
	if parse_result == OK:
		var data = json.get_data()
		SetRoom(data)
		SetRoomProperties()


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


func _on_start_button_pressed():
	var payload = {"raum_id" : Global.activeRoom.raum_id}
	var json_string =  JSON.new().stringify(payload)
	Global.client.socketio_send("startPressed", json_string)
	pass 


func getRoomToken(data):
	var json = JSON.new()
	var parse_result = json.parse(data)
	if parse_result == OK:
		var jsonObject = json.get_data()
		var token = jsonObject.get("room_token", "")
		return token
	else:
		return ""
