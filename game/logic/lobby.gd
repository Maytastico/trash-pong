extends Control

# Default game server port. Can be any number between 1024 and 49151.
# Not present on the list of registered or common ports as of December 2022:
# https://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers
const DEFAULT_PORT = 8910

@onready var username = $Name
@onready var host_button = $HostButton
#@onready var join_button = $JoinButton
@onready var status_ok = $StatusOk
@onready var status_fail = $StatusFail

@onready var pingRequest = %Ping
@onready var loginRequest = %Login


var peer = null

func _ready():
	# Connect all the callbacks related to networking.
	multiplayer.peer_connected.connect(_player_connected)
	multiplayer.peer_disconnected.connect(_player_disconnected)
	multiplayer.connected_to_server.connect(_connected_ok)
	multiplayer.connection_failed.connect(_connected_fail)
	multiplayer.server_disconnected.connect(_server_disconnected)
	username.grab_focus()
#### Network callbacks from SceneTree ####

# Callback from SceneTree.
func _player_connected(_id):
	# Someone connected, start the game!
	var pong = load("res://pong.tscn").instantiate()
	# Connect deferred so we can safely erase it from the callback.
	pong.game_finished.connect(_end_game, CONNECT_DEFERRED)

	get_tree().get_root().add_child(pong)
	hide()


func _player_disconnected(_id):
	if multiplayer.is_server():
		_end_game("Client disconnected")
	else:
		_end_game("Server disconnected")


# Callback from SceneTree, only for clients (not server).
func _connected_ok():
	pass # This function is not needed for this project.


# Callback from SceneTree, only for clients (not server).
func _connected_fail():
	_set_status("Couldn't connect.", false)

	multiplayer.set_multiplayer_peer(null) # Remove peer.
	host_button.set_disabled(false)
#	join_button.set_disabled(false)


func _server_disconnected():
	_end_game("Server disconnected.")

##### Game creation functions ######

func _end_game(with_error = ""):
	if has_node("/root/Pong"):
		# Erase immediately, otherwise network might show
		# errors (this is why we connected deferred above).
		get_node(^"/root/Pong").free()
		show()

	multiplayer.set_multiplayer_peer(null) # Remove peer.
	host_button.set_disabled(false)
#	join_button.set_disabled(false)

	_set_status(with_error, false)


func _set_status(text, isok):
	# Simple way to show status.
	if isok:
		status_ok.set_text(text)
		status_fail.set_text("")
	else:
		status_ok.set_text("")
		status_fail.set_text(text)


func _on_host_pressed():
	if(username.text.strip_edges() == ""):
		_set_status("Enter a username", false)
		return
	_set_status("Connecting...", true)
	host_button.set_disabled(true)
	if(_ping() < 0):
		return
	if(_login() < 0):
		return
	
	
func _ping():
	var url = Global.apiURL + "/health/ping"
	var err = pingRequest.request(url, [], HTTPClient.METHOD_GET)
	if err != OK:
		_set_status("Internal Error", false)
		print("Failed to send request: ", err)
		return -1
	return 0
	
func _login():
	var url = Global.apiURL + "/user/login"
	Global.username = username.text
	var json_obj = {"username": Global.username}
	var json_string =  JSON.new().stringify(json_obj)

	var headers = ["Content-Type: application/json"]
	
	var err = loginRequest.request(url, headers, HTTPClient.METHOD_POST, json_string)
	if err != OK:
		_set_status("Internal Error", false)
		print("Failed to send request: ", err)
		return -1
	return 0
		
	#peer = ENetMultiplayerPeer.new()
	#var err = peer.create_server(DEFAULT_PORT, 1) # Maximum of 1 peer, since it's a 2-player game.
	#if err != OK:
		# Is another server running?
	#	_set_status("Can't host, address in use.",false)
	#	return
	#peer.get_host().compress(ENetConnection.COMPRESS_RANGE_CODER)

	#multiplayer.set_multiplayer_peer(peer)
	#host_button.set_disabled(true)
#	join_button.set_disabled(true)
	#_set_status("Waiting for player...", true)

	# Only show hosting instructions when relevant.
	#port_forward_label.visible = true
	#find_public_ip_button.visible = true


#func _on_join_pressed():
#	var ip = address.get_text()
#	if not ip.is_valid_ip_address():
#		_set_status("IP address is invalid.", false)
#		return

#	peer = ENetMultiplayerPeer.new()
#	peer.create_client(ip, DEFAULT_PORT)
#	peer.get_host().compress(ENetConnection.COMPRESS_RANGE_CODER)
#	multiplayer.set_multiplayer_peer(peer)

#	_set_status("Connecting...", true)







func _on_ping_request_completed(result, response_code, headers, body):
	if response_code == 200:
		return 0
	else:
		_set_status("No Connection", false)
		host_button.set_disabled(false)
		return -1


func _on_login_request_completed(result, response_code, headers, body):
	if result == OK and response_code == 200:
		Global.jwtToken = body.get_string_from_utf8()
		
		var raumliste = load("res://raumliste.tscn").instantiate()
		get_tree().get_root().add_child(raumliste)
		hide()
	else:
		_set_status("No Connection", false)
		host_button.set_disabled(false)
		return -1
		







func _on_name_text_submitted(new_text):
	host_button.emit_signal("pressed")
