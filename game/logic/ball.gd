extends Area2D

const DEFAULT_SPEED = 200                                               # Anfangs Speed vom Ball
var direction = Vector2.LEFT                                            # Richtubg
var stopped = false                                                     # Bewegt er sich, oder nicht
var _speed = DEFAULT_SPEED                                              # Tatsächlicher speed vom Ball
@onready var bounce_sound = $Bounce                                     # Abprall Sound
@onready var goal_sound = $Goal                                         # Sound wenn ein Spieler ein Tor schießt
@onready var _screen_size = get_viewport_rect().size                    # Bildschirmgröße (Border)

# Funktion wird bei jedem Frame aufgerufen
func _process(delta):
	_speed += delta
	# Der Ball wird sich für beide Spieler normal bewegen, 
	# auch wenn er leicht zwischen ihnen nicht synchron ist, 
	# sodass jeder Spieler die Bewegung als flüssig und nicht ruckelig wahrnimmt.
	if not stopped:
		translate(_speed * delta * direction)

	# Bildschirm Border wird überprüft um den Ball bouncen zu lassen
	var ball_pos = position
	if (ball_pos.y < 0 and direction.y < 0) or (ball_pos.y > _screen_size.y and direction.y > 0):
		bounce_sound.play()
		direction.y = -direction.y
	# Jeder Spieler checkt auf seiner eigenen Seite ob ein Tor gefallen ist oder nicht
	if Global.activeRoom.player1 == Global.username:                         # Spieler 1 checkt links
		if ball_pos.x < 0:                                                   # Tor für Spieler 2
			handleGoal(false)
	elif Global.activeRoom.player2 == Global.username:                       # Spieler 2 checkt rechts 
		if ball_pos.x > _screen_size.x:                                      # Tor für Spieler 1
			handleGoal(true)

# Ist ein Tor gefallen meldet sich der Spieler 
# und schickt ein 'goal' Event an den Gegner
# und resettet für sich den Ball
func handleGoal(left):
	var payload = {"room_token": Global.roomToken, "left": left,  "username" : Global.username}
	Global.client.socketio_send("goal", payload)
	get_parent().update_score(left)
	_reset_ball(left)
	
# Funktion lässt den Ball am Paddle abbouncen
func bounce(left, random):
	bounce_sound.play()
	if left:
		direction.x = abs(direction.x)
	else:
		direction.x = -abs(direction.x)
	_speed *= 1.5                           # Bei jedem Bounce wird der Ball vieeeeeeeeeel schneller
	direction.y = random * 2.0 - 1
	direction = direction.normalized()

# Stoppt den Ball
func stop():
	stopped = true

# Ball wird wieder auf die Mitte gesetzt
# Und startet in der Richtung von dem der das Tor geschossen hat
func _reset_ball(for_left):
	goal_sound.play()
	position = _screen_size / 2
	if for_left:
		direction = Vector2.LEFT
	else:
		direction = Vector2.RIGHT
	_speed = DEFAULT_SPEED
