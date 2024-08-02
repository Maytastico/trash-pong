extends Control


# Called when the node enters the scene tree for the first time.
func _ready():
	pass # Replace with function body.


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	pass





func _on_cancel_button_pressed():
	var root = get_tree().get_root()
	root.remove_child(self)
	self.queue_free()
	
	for child in root.get_children():
		child.show()

