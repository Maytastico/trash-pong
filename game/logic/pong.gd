extends Node2D

signal game_finished()

const SCORE_TO_WIN = 10

var score_left = 0
var score_right = 0

@onready var player2 = $Player2
@onready var score_left_node = $ScoreLeft
@onready var score_right_node = $ScoreRight
@onready var winner_left = $WinnerLeft
@onready var winner_right = $WinnerRight
@onready var gamefield = $ColorRect
func _ready():
	gamefield.size = get_viewport().size

	pass


func update_score(add_to_left):
	if add_to_left:
		score_left += 1
		score_left_node.set_text(str(score_left))
	else:
		score_right += 1
		score_right_node.set_text(str(score_right))

	var game_ended = false
	if score_left == SCORE_TO_WIN:
		winner_left.show()
		game_ended = true
	elif score_right == SCORE_TO_WIN:
		winner_right.show()
		game_ended = true

	if game_ended:
		$ExitGame.show()
		$Ball.stop.rpc()


func _on_exit_game_pressed():
	game_finished.emit()
