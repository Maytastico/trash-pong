extends Node
############################ GLOBALE VARIABLEN ####################################

var apiURL = "http://localhost:3000" 								# Server URL
#const apiURL = "http://192.168.2.104:3000" 						# Server URL
@onready var jwtToken: String  =""       							# JWT Token zum Authentifizieren
@onready var username: String = ""									# Username der beim Login gesetzt wird
var rooms = []														# Liste der Räume aus der Datenbank
@onready var client													# Socket-IO Client für die Spiel Kommunikation
@onready var activeRoomID : int = -1								# RaumID die gesetzt wird wenn man Raum joint
@onready var activeRoom 											# Raum der gesetzt wird wenn man einem Raum joint
@onready var roomToken												# Room Token (wichtig für den Server damit der Raum zugeordnet werden kann)

##########################################################################################################
