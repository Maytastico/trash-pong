extends Control

@onready var CreatorLabel = $CreatorLabel
@onready var JoinerLabel = $JoinedLabel
@onready var RaumLabel = $Raumname
@onready var NumberOfPlayers = $NumberOfPlayers
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
	else:
		_payload = {"roomId" : Global.rooms[Global.activeRoomID].raum_id, "playerId" : 3}
		Global.client.socketio_send("joinRoom", _payload)
		SetRoomProperties()
		self.show()
		
func on_socket_ready(_sid: String):
	Global.client.socketio_connect()

func on_socket_event(event_name: String, payload: Variant, _name_space):
	print("Received ", event_name, " ", payload)
	SetRoomProperties()
	pass

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
	if(Global.rooms[Global.activeRoomID].player2 == ""):
		number = 1
	else:
		number = 2
	NumberOfPlayers.text = str(number)+ "/2"
	
	
func SetRoomProperties():
		CreatorLabel.text = Global.rooms[Global.activeRoomID].player1
		JoinerLabel.text = Global.rooms[Global.activeRoomID].player2
		RaumLabel.text = Global.rooms[Global.activeRoomID].title
		ChangeNumberOfPlayers()
