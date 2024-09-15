extends Node2D


const SCORE_TO_WIN = 10                                                        # Nach 10 Wins endet das Spiel

var score_left = 0                                                              # Score Spieler 1
var score_right = 0                                                             # Score Spieler 2

@onready var score_left_node = $ScoreLeft                                       # Label Score Spieler 1
@onready var score_right_node = $ScoreRight                                     # Label Score Spieler 2
@onready var winner_left = $WinnerLeft                                          # Label das angezeigt wird wenn Spieler 1 gewinnt
@onready var winner_right = $WinnerRight                                        # Label das angezeigt wird wenn Spieler 2 gewinnt
@onready var gamefield = $ColorRect                                             # Das Spielfeld

# Zu Beginn wird das Spielfeld auf Vollbild gesetzt
func _ready():
	gamefield.size = get_viewport().size


# Funktion wird aufgerufen wenn über dem Websocket 
# das "goal" Event ankommt
# Die Funktion nimmt als Parameter einen bool ob der Score
# auf der rechten oder Linken Seite addiert werden Soll
func update_score(add_to_left):
	if add_to_left:                                                            # Spieler 1 hat ein Tor gemacht
		score_left += 1
		score_left_node.set_text(str(score_left))                            
	else:                                                                      # Spieler 2 hat ein Tor gemacht
		score_right += 1
		score_right_node.set_text(str(score_right))

# Wenn ein Spieler 10 Punkte erreicht hat endet das spiel
	var game_ended = false
	if score_left == SCORE_TO_WIN:                                            
		winner_left.show()
		game_ended = true
	elif score_right == SCORE_TO_WIN:
		winner_right.show()
		game_ended = true

# Ist das Spiel Beendet wird an den Websocket das "end" Event geschickt
	if game_ended:
		var payload = {"room_token": Global.roomToken,  "username" : Global.username} # Room Token um den Raum identifizieren zu können + Username (validierung)
		Global.client.socketio_send("end", payload)


