extends Control

# Szenen Nodes
@onready var click_sound = $"../Click"                                    # Klick Sound Node
@onready var username = $Name                                             # Username Textbox
@onready var host_button = $HostButton                                    # Connect-Knopf
@onready var status_ok = $StatusOk                                        # Weiße Status Meldung
@onready var status_fail = $StatusFail                                    # Rote Statusmeldung
@onready var pingRequest = %Ping                                          # Ping HTTP-Request
@onready var loginRequest = %Login                                        # Login HTTP-Request
@onready var ServerURLLabel = $"../ServerURL"
# Funktion wird Aufgerufen wenn die Szene Startet
func _ready():
	username.grab_focus()                                                 # Focus wird auf die Textbox gesetzt (man muss nicht mehr mit der Maus extra drauf drücken) 
	get_viewport().size = DisplayServer.screen_get_size()                 # Fenstergröße wird auf Vollbild gesetzt
	getServerURLFromEnv()                                                 # Andere URL aus Umgebungsvariablen bekommen
	ServerURLLabel.text = Global.apiURL                                   # DEBUG LABEL oben Links

func getServerURLFromEnv():
	var env_api_url = OS.get_environment("PONG_SERVER_URL")
	var env_api_port = OS.get_environment("PONG_SERVER_PORT")
	if env_api_url != "" && env_api_port != "":
		Global.apiURL = env_api_url + ":" + str(env_api_port)

# Funktion um Fehlernachrichten anzuzeigen
func _set_status(text, isok):
	if isok:                                                              # Enntweder roter oder weißer Text
		status_ok.set_text(text)
		status_fail.set_text("")
	else:
		status_ok.set_text("")
		status_fail.set_text(text)

# Wenn der Connect-Knopf gedrückt wird
func _on_host_pressed():
	click_sound.play()                                                     # Click Sound wird abgespielt
	if(username.text.strip_edges() == ""):                                 # Textfeld darf nicht leer sein
		_set_status("Enter a username", false)
		return
	_set_status("Connecting...", true)                                     
	host_button.set_disabled(true)                                         # Knopf wird deaktiviert um mehrere Anfragen zu vermeiden
	if(_ping() < 0):                                                       # Es wird geschaut ob der Server online ist
		return
	if(_login() < 0):                                                      # Wenn Server Online ist, wird Login versuch gestartet
		return
	
# Funktion Sendet einen Asyncronen Ping Request an den Server
# Wenn der Request erfolgt ist wird die _on_ping_request_completed() Funktion aufgerufen
func _ping():
	var url = Global.apiURL + "/health/ping"
	var err = pingRequest.request(url, [], HTTPClient.METHOD_GET)         # Neuer HTTP-GET-Request ohne Header & Payload wird verschickt
	if err != OK:                                                         # Wenn in der Libary was schief gegangen ist wird nicht weitergemacht
		_set_status("Internal Error", false)
		print("Failed to send request: ", err)
		return -1
	return 0


# Funktion Sendet einen Asyncronen Request an den Server um sich zu registrieren
# Wenn der Request erfolgt ist wird die _on_login_request_completed() Funktion aufgerufen
func _login():
	var url = Global.apiURL + "/user/login"
	Global.username = username.text                                               # Der Username aus der Textbox wird in eine Globale Variable gespeichert
	var json_obj = {"username": Global.username}                                  # Username wird in ein JSON-Objekt gepackt
	var json_string =  JSON.new().stringify(json_obj)                             # und geparsed

	var headers = ["Content-Type: application/json"]                              # ist selbsterklärend...
	
	var err = loginRequest.request(url, headers, HTTPClient.METHOD_POST, json_string) # neier HTTP-POST-Request mit dem Username und dem Json Header wird an den Server gesendet
	if err != OK:                                                                 # Wenn in der Libary was schief gegangen ist wird nicht weitergemacht
		_set_status("Internal Error", false)      
		print("Failed to send request: ", err)
		return -1
	return 0


# Funktion wird nach dem Ping-Request ausgeführt
func _on_ping_request_completed(result, response_code, headers, body):
	if response_code == 200:                                                    # Verbindung steht, können so weiter machen
		return 0
	else:
		_set_status("No Connection", false)                                     # Keine Verbindung :(
		host_button.set_disabled(false)                                         # Connect Knopf wird wieder Aktiviert, falls man es erneut versuchen will
		return -1

# Funktion wird nach dem Login-Request ausgeführt
func _on_login_request_completed(result, response_code, headers, body):
	if result == OK and response_code == 200:                                   # Login hat Funktioniert und es steht was in der Response
		Global.jwtToken = body.get_string_from_utf8()                           # JWT-Token wird aus der Response genommen und in einer Globalen Variable abgespeichert
		var raumliste = load("res://raumliste.tscn").instantiate()              # Die Raumliste (Szene) wird geladen
		get_tree().get_root().add_child(raumliste)                              # und wird dem Baum angehängt
		hide()                                                                  # Die jetzige Szene wird versteckt (Ist ja der Root, sonst könnte man die auch löschen)
	else:                                                                       # Login hat nicht geklappt
		_set_status("Login failed", false)
		host_button.set_disabled(false)                                         # Knopf wird wieder aktiviert, falls man es erneur versuchen möchte
		return -1
		

# Funktion wird aufgerufen, wenn man beim Textfeld Enter-drückt
func _on_name_text_submitted(new_text):
	host_button.emit_signal("pressed")                                         # Das 'pressed' Signal wird ausgelöst, sodass man mit dem Enter Knopf sich verbinden kann

# Exit Knopf 
func _on_button_pressed():
	get_tree().quit()                                                          # Spiel wird beendet

# Exit Knopf
func _on_exit_button_down():
	click_sound.play()                                                         # Klick sound wird abgespielt 
																			   # Wird der sound im _pressed() Event gecallt, wird der nicht abgespielt da die Instanz schon vorher zerstört wurde
