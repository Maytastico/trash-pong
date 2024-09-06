extends Node


const apiURL = "http://localhost:3000" # API-URL
@onready var jwtToken: String  =""       
@onready var username: String = ""
var rooms = []
@onready var client
@onready var activeRoomID : int = -1
@onready var activeRoom 
@onready var roomToken
