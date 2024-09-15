extends Area2D

const MOTION_SPEED = 350                                                        # Geschwindigkeit der Paddles
@export var left = false                                                        # Spieler 1 oder 2
var _motion = 0                                                                 # Hoch oder runter
var _you_hidden = false                                                         # Das Logo welches Anzeigt welcher Paddle man ist
@onready var _screen_size_y = get_viewport_rect().size.y                        # Höhe des Bildschirms damit der Ball am Rand abbounced

# Funktion wird jedes Frame aufgerufen
func _process(delta):
	if Global.activeRoom.player1 == Global.username && left:                    # Spieler 1 steuert nur das linke Paddle
		handleMovement()
	elif Global.activeRoom.player2 == Global.username && !left:                 # Spieler 2 steuert nur das rechte Paddle
		handleMovement()
	else:
		if not _you_hidden:                                                     # Versteckt das You Label des Gegner
			_hide_you_label() 
	translate(Vector2(0, _motion * delta))                                      # Bewegt das Paddle in einer smooth
	position.y = clamp(position.y, 16, _screen_size_y - 16)                     # Setzt die Screen Limits

func handleMovement():
	_motion = Input.get_axis(&"move_up", &"move_down")                          # W oder S
	if not _you_hidden and _motion != 0:                                        # Beim ersten Mal bewegen wird das Label versteckt
		_hide_you_label()
	_motion *= MOTION_SPEED                                                     # Motion nach oben oder unten
	
	#Payload enthält X, Y Position und die motion um beim Gegner das selbe anzeigen zu können. Der Room Token identifiziert den Raum
	var payload = {"room_token": Global.roomToken, "position_x": position.x, "position_y" :  position.y, "motion": _motion, "username" : Global.username}
	Global.client.socketio_send("update_paddle", payload)                       # Position des Paddles wird über das "update_paddle" Event an den Gegner 
																				# verschickt

# Setzt die Position des Paddles
# Funktion wird aufgerufen wenn über den
# Websocket das 'update_paddle' Event kommt
func set_pos_and_motion(pos, motion):
	position = pos
	_motion = motion

# Versteckt das you_label
func _hide_you_label():
	_you_hidden = true
	get_node(^"You").hide()

# Sobald der Ball ein Paddle berührt wird prallt der Ball ab
func _on_paddle_area_enter(area):
	if Global.activeRoom.player1 == Global.username && left:                    # Spieler 1 Handled den Bounce auf seiner Seite (linke Seite)
		handleBounce(area)
	elif Global.activeRoom.player2 == Global.username && !left:                 # Spieler 2 Handled den Bounce auf seiner Seite (rechte Seite)
		handleBounce(area)


# Lässt den Ball abbouncen
func handleBounce(area):
	var random = randf()                                                        # Random Winkel wo der abprallt
# Im Payload wird der Winkel und die Seite wo abgeprallt wurde, mitgegeben
	var payload = {"room_token": Global.roomToken, "left": left, "random" :  random,  "username" : Global.username}
	area.bounce(left, random)                                                   # Jeder Spieler lässt seine eigene Seite selber abbouncen
	Global.client.socketio_send("bounce", payload)                              # Und überträgt dann die Daten an den Gegner
