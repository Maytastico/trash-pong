extends Control


# Called when the node enters the scene tree for the first time.
func _ready():
	Global.client = SocketIOClient.new(Global.apiURL, {"token": Global.jwtToken} )
	Global.client.on_engine_connected.connect(on_socket_ready)
	Global.client.on_connect.connect(on_socket_connect)
	Global.client.on_event.connect(on_socket_event)
	add_child(Global.client)
	pass # Replace with function body.


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	pass

func on_socket_connect(_payload: Variant, _name_space, error: bool):
	pass
func on_socket_ready(_sid: String):
	pass

func on_socket_event(event_name: String, payload: Variant, _name_space):
	pass

func _on_leave_button_pressed():
	var root = get_tree().get_root()
	root.remove_child(self)

	self.queue_free()
	
	for child in root.get_children():
		if child is Control:
			if child.name == "CreateRoom":
				continue
			child.show()
