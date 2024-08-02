extends Control


@onready var validateSessionRequest = $ValidateSession
@onready var createRoomRequest = $CreateRoom
@onready var RoomnameObject = $RoomNameLabel/Roomname
@onready var PasswordLabel = $PasswordLabel/Password
@onready var requirePasswordObject = $RequirePassword

# Called when the node enters the scene tree for the first time.
func _ready():
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
	var needsPassword = requirePasswordObject.toggled 
	var password = PasswordLabel.text
	var jsonObject = {
		"title" : Roomname,
		"password" : password,
		"public" : needsPassword,
		"playerID" : 1
	}
	var json_string =  JSON.new().stringify(jsonObject)
	var url = Global.apiURL + "/api/room"
	var token = Global.jwtToken
	var headers = ["Authorization: Bearer %s" % token]
	createRoomRequest.request(url, headers, HTTPClient.METHOD_POST, json_string)



func _on_create_room_request_completed(result, response_code, headers, body):
	pass # Replace with function body.
