extends Control


# Called when the node enters the scene tree for the first time.
func _ready():
	pass # Replace with function body.


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	pass


func _on_join_room_pressed():
	var imraum = load("res://im_raum.tscn").instantiate()

	get_tree().get_root().add_child(imraum)
	hide()
