extends Control

# Called when the node enters the scene tree for the first time.
func _ready():
	pass # Replace with function body.


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	pass

func _canceled():
	if has_node("/root/imraum"):
		get_node(^"/root/imraum").free()
		show()
		

func _on_join_room_pressed():
	var imraum = load("res://im_raum.tscn").instantiate()
	get_tree().get_root().add_child(imraum)
	hide()


func _on_create_room_pressed():
	var createroom = load("res://create_room.tscn").instantiate()
	get_tree().get_root().add_child(createroom)
	hide()
