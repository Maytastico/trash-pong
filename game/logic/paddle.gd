extends Area2D

const MOTION_SPEED = 150

@export var left = false

var _motion = 0
var _you_hidden = false

@onready var _screen_size_y = get_viewport_rect().size.y

func _process(delta):
	# Is the master of the paddle.
	if Global.activeRoom.player1 == Global.username && left:
		handleMovement()
	elif Global.activeRoom.player2 == Global.username && !left:
		handleMovement()
	else:
		if not _you_hidden:
			_hide_you_label()

	translate(Vector2(0, _motion * delta))

	# Set screen limits.
	position.y = clamp(position.y, 16, _screen_size_y - 16)

func handleMovement():
	_motion = Input.get_axis(&"move_up", &"move_down")
	if not _you_hidden and _motion != 0:
		_hide_you_label()
	_motion *= MOTION_SPEED
	var le_string = {"room_token": Global.roomToken, "position": position, "motion": _motion, "username" : Global.username}
	var payload = JSON.new().stringify(le_string)
	print(payload)
	Global.client.socketio_send("update_paddle", payload)

#@rpc("unreliable")
func set_pos_and_motion(pos, motion):
	position = pos
	_motion = motion


func _hide_you_label():
	_you_hidden = true
	get_node(^"You").hide()


func _on_paddle_area_enter(area):
	if is_multiplayer_authority():
		pass
		# Random for new direction generated checked each peer.
		#area.bounce.rpc(left, randf())
