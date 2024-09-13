extends Area2D

const DEFAULT_SPEED = 200

var direction = Vector2.LEFT
var stopped = false
var _speed = DEFAULT_SPEED
@onready var bounce_sound = $Bounce
@onready var goal_sound = $Goal
@onready var _screen_size = get_viewport_rect().size

func _process(delta):
	_speed += delta

	# Ball will move normally for both players,
	# even if it's sightly out of sync between them,
	# so each player sees the motion as smooth and not jerky.
	if not stopped:
		translate(_speed * delta * direction)

	# Check screen bounds to make ball bounce.
	var ball_pos = position
	if (ball_pos.y < 0 and direction.y < 0) or (ball_pos.y > _screen_size.y and direction.y > 0):
		bounce_sound.play()
		direction.y = -direction.y
	if Global.activeRoom.player1 == Global.username:
		if ball_pos.x < 0:
			handleGoal(false)
	elif Global.activeRoom.player2 == Global.username:
		if ball_pos.x > _screen_size.x:
			handleGoal(true)

func handleGoal(left):
	var payload = {"room_token": Global.roomToken, "left": left,  "username" : Global.username}
	Global.client.socketio_send("goal", payload)
	get_parent().update_score(left)
	_reset_ball(left)
#@rpc("any_peer", "call_local")
func bounce(left, random):
	bounce_sound.play()
	if left:
		direction.x = abs(direction.x)
	else:
		direction.x = -abs(direction.x)

	_speed *= 1.5
	direction.y = random * 2.0 - 1
	direction = direction.normalized()



func stop():
	stopped = true



func _reset_ball(for_left):
	goal_sound.play()
	position = _screen_size / 2
	if for_left:
		direction = Vector2.LEFT
	else:
		direction = Vector2.RIGHT
	_speed = DEFAULT_SPEED
