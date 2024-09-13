extends Control

# Default game server port. Can be any number between 1024 and 49151.
# Not present on the list of registered or common ports as of December 2022:
# https://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers
const DEFAULT_PORT = 8910
@onready var click_sound = $"../Click"
@onready var username = $Name
@onready var host_button = $HostButton
#@onready var join_button = $JoinButton
@onready var status_ok = $StatusOk
@onready var status_fail = $StatusFail

@onready var pingRequest = %Ping
@onready var loginRequest = %Login



func _ready():
	username.grab_focus()
	get_viewport().size = DisplayServer.screen_get_size()




func _set_status(text, isok):
	# Simple way to show status.
	if isok:
		status_ok.set_text(text)
		status_fail.set_text("")
	else:
		status_ok.set_text("")
		status_fail.set_text(text)


func _on_host_pressed():
	click_sound.play()
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


func _on_button_pressed():
	click_sound.play()
	get_tree().quit() # Replace with function body.
