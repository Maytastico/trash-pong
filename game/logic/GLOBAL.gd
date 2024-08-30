extends Node


const apiURL = "http://localhost:3000" # API-URL
@onready var jwtToken: String  =""       
@onready var username: String = ""
var rooms = []
@onready var client = SocketIOClient
@onready var activeRoomID : int = -1
