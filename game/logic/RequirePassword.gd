extends CheckButton

@onready var passwordlabel = $"../PasswordLabel"
@onready var click_sound = $"../Click"




func _on_toggled(toggled_on):
	click_sound.play()
	if (toggled_on):
		passwordlabel.visible = true
	if(!toggled_on):
		passwordlabel.visible = false





