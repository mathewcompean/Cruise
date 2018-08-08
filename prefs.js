//------------------------------------
// release dates
//------------------------------------

var oCONFIG = {
	game_id: "ht3_cruise_1",
	language_file :"language/en-us.xml",
	debug_trace: false,
	debug_panel: false,
	debug_stats: false,
	browser_alert: "browser_alert/",
	splash_hold: 2,
	landscale_target_width: 30,
	portrait_target_width: 25 
}

// The date string must be formatted as shown. These is used as date cuttoffs and is not displayed in the program.
var date_playing = "July 27, 2018";
var date_day_before = "July 26, 2018";
var date_week_before = "July 20, 2018";

var game_sequence = [
  {amt: 0.1, speed:0.005},
  {amt: -0.2, speed:0.005},
  {amt: 0.4, speed:0.005},
  {amt: -0.1, speed:0.005},
  {amt: 0.1, speed:0.005},
  {amt: -0.6, speed:0.005},
  {amt: 0.2, speed:0.005},
  {amt: 0.6, speed:0.005},
  {amt: 0.1, speed:0.01},
  {amt: -0.2, speed:0.01},
  {amt: 0.4, speed:0.005},
  {amt: -0.3, speed:0.01},
  {amt: 0.4, speed:0.01},
  {amt: -0.6, speed:0.01},
  {amt: 0.6, speed:0.005},
  {amt: 0.1, speed:0.005}
];

//assets to be processed for threejs
var assets_threejs = {
  loaded: false,
  progress: 0,
  manifest: [
    {src:"media/models/deck.json", 			name:"deck", type:"static"},
    {src:"media/models/obstacles.json", 	name:"obstacles", type:"static"},
    {src:"media/models/particle_water.png", name:"particle_water", type:"texture"},
    {src:"media/models/particle_cloud.png", name:"particle_cloud", type:"texture"},
    {src:"media/score_digits.png", 			name:"score_digits", type:"texture"}
	
  ]
};

var assets_threejs_game = {
  loaded: false,
  progress: 0,
  manifest: [
	  
	{src:"media/game/PowerEdgeGlow.png",	name:"PowerEdgeGlow", type:"texture"},	
	{src:"media/game/PowerButton.png",		name:"PowerButton", type:"texture"},	
	{src:"media/game/PowerMeter.png",		name:"PowerMeter", type:"texture"},	
	{src:"media/game/PowerMeterBase.png",	name:"PowerMeterBase", type:"texture"},
	  
    {src:"media/models/Bat_.png", 			name:"Bat_", type:"texture"},
	{src:"media/models/Float.png", 			name:"Float", type:"texture"},
	{src:"media/models/DeckChair_Hit.png", 	name:"DeckChair_Hit", type:"texture"},
	{src:"media/models/DeckChair_Up.png", 	name:"DeckChair_Up", type:"texture"},
	{src:"media/models/DeckChair_Witch_Hit.png", name:"DeckChair_Witch_Hit", type:"texture"},
	{src:"media/models/DeckChair_Witch_Up.png", name:"DeckChair_Witch_Up", type:"texture"},
	{src:"media/models/Door_Closed.png", 	name:"Door_Closed", type:"texture"},
	{src:"media/models/Door_Hit.png", 		name:"Door_Hit", type:"texture"},
	{src:"media/models/Door_Open.png", 		name:"Door_Open", type:"texture"},
	{src:"media/models/Luggage_Hit.png", 	name:"Luggage_Hit", type:"texture"},
	{src:"media/models/Luggage_Up.png", 	name:"Luggage_Up", type:"texture"},
	{src:"media/models/MariachiGroup.png", 	name:"MariachiGroup", type:"texture"},
	{src:"media/models/ZombiePorter_Hit.png",name:"ZombiePorter_Hit", type:"texture"},
	{src:"media/models/ZombiePorter_Up.png",name:"ZombiePorter_Up", type:"texture"},	
	{src:"media/game/Frank_Health.png",		name:"Frank_Health", type:"texture"},  
	{src:"media/game/Murray_Health.png",	name:"Murray_Health", type:"texture"},
    {src:"media/models/sky.jpg", 			name:"sky", type:"texture"},
]
};

var assets_threejs_1 = {
  loaded: false,
  progress: 0,
  manifest: [
    {src:"media/models/Drac_.png", 		name:"Drac_", type:"texture"},
	{src:"media/game/Drac_Health.png",name:"Drac_Health", type:"texture"},
	{src:"media/game/PowerIcon1.png",name:"PowerIcon1", type:"texture"},
	{src:"media/game/Health_4.png",name:"Health_4", type:"texture"}
	  ]
};

var assets_threejs_2 = {
  loaded: false,
  progress: 0,
  manifest: [
    {src:"media/models/Mavis_.png", 	name:"Mavis_", type:"texture"},
	{src:"media/game/PowerIcon2.png",name:"PowerIcon1", type:"texture"},
	{src:"media/game/Mavis_Health.png",name:"Mavis_Health", type:"texture"},
	{src:"media/game/Health_3.png",name:"Health_3", type:"texture"}
	  ]
};

var assets_threejs_3 = {
  loaded: false,
  progress: 0,
  manifest: [
    {src:"media/models/Frank_.png", 	name:"Frank_", type:"texture"},
	{src:"media/game/PowerIcon2.png",name:"PowerIcon1", type:"texture"},
	{src:"media/game/Health_6.png",name:"Health_6", type:"texture"}
  ]
};

var assets_threejs_4 = {
  loaded: false,
  progress: 0,
  manifest: [
	{src:"media/game/PowerIcon2.png",name:"PowerIcon1", type:"texture"},
    {src:"media/models/Murray_.png", 	name:"Murray_", type:"texture"},
	{src:"media/game/Health_3.png",name:"Health_3", type:"texture"},
  ]
};


//© 2017 Sony Pictures Digital Productions Inc. All Rights Reserved.

//assets needed before title screen
var assets_preload = {
  loaded: false,
  progress: 0,
  manifest: [
    {src:"media/fonts/MontserratBold.woff", id:"MontserratBold"},
    {src:"media/fonts/MontserratRegular.woff", id:"MontserratRegular"},
    {src:"media/fonts/MouseMemoirs-Regular.woff", id:"MouseMemoirs-Regular"},

    {src:"media/logo_en.png", id:"logo_en"},
    {src:"media/instructions.gif", id:"instructions"},
    {src:"media/bg_title.jpg", id:"bg_title"},
    {src:"media/cruise_title.png", id:"blobby_title"},
    {src:"media/b_fullscreen_off.svg", id:"b_fullscreen_off"},
    {src:"media/b_fullscreen_on.svg", id:"b_fullscreen_on"},
    {src:"media/b_pause.svg", id:"b_pause"},
    {src:"media/b_sound_off.svg", id:"b_sound_off"},
    {src:"media/b_sound_on.svg", id:"b_sound_on"},
    {src:"media/b_fullscreen_off_over.svg", id:"b_fullscreen_off_over"},
    {src:"media/b_fullscreen_on_over.svg", id:"b_fullscreen_on_over"},
    {src:"media/b_pause_over.svg", id:"b_pause_over"},
    {src:"media/b_sound_off_over.svg", id:"b_sound_off_over"},
    {src:"media/b_sound_on_over.svg", id:"b_sound_on_over"},

    {src:"media/sounds/music_title_loop.mp3", id:"music_title_loop"},
    {src:"media/sounds/snd_click.mp3", id:"snd_click"},
	  
	{src:"media/sounds/Cruise_Jump.mp3", 			id:"Cruise_Jump", type:"sound"},
    {src:"media/sounds/Cruise_Hit.mp3", 			id:"Cruise_Hit", type:"sound"},
    {src:"media/sounds/Cruise_Hit2.mp3", 			id:"Cruise_Hit2", type:"sound"},
    {src:"media/sounds/Cruise_Splash.mp3", 			id:"Cruise_Splash", type:"sound"},
    {src:"media/sounds/Cruise_ZombieHit.mp3", 		id:"Cruise_ZombieHit", type:"sound"},
    {src:"media/sounds/Cruise_Slide.mp3", 			id:"Cruise_Slide", type:"sound"},
	  
	{src:"media/sounds/Cruise_DracRun.mp3", 		id:"Cruise_DracRun", type:"sound"},
    {src:"media/sounds/Cruise_DracAttack.mp3", 		id:"Cruise_DracSpecial", type:"sound"},
	  
	{src:"media/sounds/Cruise_MavisRun.mp3", 		id:"Cruise_MavisRun", type:"sound"},
    {src:"media/sounds/Cruise_BatWings.mp3", 		id:"Cruise_MavisSpecial", type:"sound"},
	  
    {src:"media/sounds/Cruise_FrankRun.mp3", 		id:"Cruise_FrankRun", type:"sound"},
    {src:"media/sounds/Cruise_FrankRun.mp3", 		id:"Cruise_FrankSpecial", type:"sound"},
	  
	{src:"media/sounds/Cruise_MurrayRun.mp3", 		id:"Cruise_MurrayRun", type:"sound"},
    {src:"media/sounds/Cruise_Roll.mp3", 			id:"Cruise_MurraySpecial", type:"sound"}
  ]
};


//assets needed before gameplay
var assets_additional = {
  loaded: false,
  progress: 0,
  manifest: [
   
    //{src:"media/blobby_recap.png", id:"blobby_recap"},
    {src:"media/game_buttons.png", id:"game_buttons"},

    {src:"media/sounds/music_game_in.mp3", id:"music_game_in"},
    {src:"media/sounds/music_game_loop.mp3", id:"music_game_loop"},
    {src:"media/sounds/music_game_end.mp3", id:"music_game_end"},
    //{src:"media/sounds/sfx_barf.mp3", id:"sfx_barf"},
    {src:"media/sounds/sfx_splash.mp3", id:"sfx_splash"},

	{id:"PickerBackground", src:"media/picker/PickerBackground.jpg"},
	{id:"FrankBody", src:"media/picker/FrankBody.png"},
	{id:"MavisBody", src:"media/picker/MavisBody.png"},
	{id:"DracBody", src:"media/picker/DracBody.png"},
	{id:"MurrayBody", src:"media/picker/MurrayBody.png"},
	{id:"PickerBackButton", src:"media/picker/PickerBackButton.png"},
	{id:"PickerPlayButton", src:"media/picker/PickerPlayButton.png"},
	{id:"FrankLockImage", src:"media/picker/small_lock.png"},
	{id:"small_lock", src:"media/picker/small_lock.png"},
	{id:"MurrayStatsImage", src:"media/picker/MurrayStatsImage.png"},
	{id:"FrankStatsImage", src:"media/picker/FrankStatsImage.png"},
	{id:"MavisStatsImage", src:"media/picker/MavisStatsImage.png"},
	{id:"DracStatsImage", src:"media/picker/DracStatsImage.png"},
	{id:"MurrayStatsImageBackground", src:"media/picker/DefaultStatsImage.png"},
	{id:"FrankStatsImageBackground", src:"media/picker/DefaultStatsImage.png"},
	{id:"MavisStatsImageBackground", src:"media/picker/DefaultStatsImage.png"},
	{id:"DracStatsImageBackground", src:"media/picker/DefaultStatsImage.png"},
	{id:"SelectedImageBackground", src:"media/picker/SelectedStatsImage.png"}
  ]
};

var main_site_url = "http://www.hotelt3.com/";

var legal_images = [
  {src: "media/SonyAnimation.png", alt:"SonyAnimation"},
 // {src: "media/cplogo.png", alt:"ColumbiaPictures"},
  {src: "media/sonylogo.png", alt:"SonyPictures"}
];

var legal_links = [
  {msg: "legal_childrens_privacy", link:"http://www.sonypictures.com/corp/childrensprivacy.html", after:" | "},
  {msg: "legal_privacy", link:"http://www.sonypictures.com/corp/privacy.html", after:" | "},
  {msg: "legal_adchoices", link:"http://www.sonypictures.com/corp/privacy.html#choices", after:" | "},
  {msg: "legal_terms", link:"http://www.sonypictures.com/corp/tos.html", after:" | "},
  {msg: "legal_cal_privacy", link:"http://www.sonypictures.com/corp/privacy.html#privacy-rights", after:"<br>"},
  {msg: "legal_copyright",link:null,after:null}
];

var animations = {
	"Drac": {
		"Run": 			{"loop":true,"cells":[23,24,25,26,27,28,29,30,31,32,33,34]},
		"Brake": 		{"loop":true,"cells":[1,2,3,2]},
		//"SpecialStart": {"loop":false,"cells":[1,2,3,4],"chain":"Special"},
		"SpecialStart": {"loop":true,"cells":[5,6,7]},
		//"Special": 		{"loop":true,"cells":[5,6,7]},
		"FallAndUp":  	{"loop":false,"cells":[8,9,10,11,12,13,14,15,16,17,18],"chain":"Run"},
		"JumpStart":  	{"loop":false,"cells":[44,19,45]},	
		"Land":  		{"loop":false,"cells":[20,21,22],"chain":"Run"},
		"Duck":  		{"loop":true,"cells":[35,36,37,38]},
		"Stand":  		{"loop":true,"cells":[46]},
		"Splash":  		{"loop":false,"cells":[39,40,41,42,43]}
	},
	"Mavis": {
		"Run": 			{"loop":true,"cells":[23,24,25,26,27,28,29,30,31]},//,27,28,29
		"Brake": 		{"loop":true,"cells":[1,2,3,4]},
		"SpecialStart": {"loop":false,"cells":[32], "chain":"Special"},
		"Special": 		{"loop":true,"cells":[33,34,35,36,37,38,38,40,41]},//32,33,34,35,36,37,38,39,40]},
		"FallAndUp":  	{"loop":false,"cells":[9,10,11,12,13,14,15,16,17,18,19,20],"chain":"Run"},
		"JumpStart":  	{"loop":false,"cells":[20,21,22]},
		"Land":  		{"loop":false,"cells":[18,19],"chain":"Run"},
		"Duck":  		{"loop":true,"cells":[5,6,7,8]},
		"Stand":  		{"loop":true,"cells":[48]}, // Frame 49 doesn't exist for Mavis...
		"Splash":  		{"loop":false,"cells":[38,39,40,41,42]}//42,43,44,45,46]}
	},
	"Murray": {
		"Run": 			{"loop":true,"cells":[26,27,28,29,30,31,32,33,34,35,36,37,38,39]},
		"Brake": 		{"loop":true,"cells":[1,2,3,4]},
		"SpecialStart":	{"loop":true,"cells":[5,6,7,8,9,10,11,12]},
		"FallAndUp": 	{"loop":false,"cells":[13,14,15,16,17,18,19,20,21],"chain":"Run"},
		"JumpStart": 	{"loop":false,"cells":[23,24,25]},
		"Land": 		{"loop":false,"cells":[50,51,52],"chain":"Run"},
		"Duck":  		{"loop":true,"cells":[41,42,43,44]},
		"Stand":  		{"loop":true,"cells":[53]},
		"Splash": 		{"loop":false,"cells":[45,46,47,48,49]}
	},
	"Frank": {
		"Run": 			{"loop":true,"cells":[24,25,26,27,28,29,30,31,32,33,34,35,36,37]},
		"SpecialStart":	{"loop":true,"cells":[1,2,3,4,5,6,7,8,9,10,11,12,13,14]}, 
		"Duck": 		{"loop":true,"cells":[15,16,17,18]},
		"JumpStart": 	{"loop":false,"cells":[44,45]},
		"Land": 		{"loop":false,"cells":[46,47],"chain":"Run"},
		"Brake": 		{"loop":true,"cells":[19,20]},
		"FallAndUp": 	{"loop":false,"cells":[46,47,48,49,50,50,50,50,49,47],"chain":"Run"},
		"Stand":  		{"loop":true,"cells":[21]},
		"Splash": 		{"loop":true,"cells":[39,40,41,42,43]}
	},
	"Obstacles": {
		"Bat1":		 	{"w":1,"mode":"hi","y":4,"s":1.5,"type":"deck",name:"Bat_",gridSize:1,animDef:{"default":{"loop":true,"cells":[1,2,3,4,5,6,7,8,9,10]}},atlasId:"Bat_Atlas",atlasUrl:"media/models/Bat_.json"},
		"Bat2":		 	{"w":1,"mode":"hi","y":4,"s":1.5,"type":"deck",name:"Bat_",gridSize:1,animDef:{"default":{"loop":true,"cells":[1,2,3,4,5,6,7,8,9,10]}},atlasId:"Bat_Atlas",atlasUrl:"media/models/Bat_.json"},
		"Bat3":		 	{"w":1,"mode":"hi","y":4,"s":1.5,"type":"wall",name:"Bat_",gridSize:1,animDef:{"default":{"loop":true,"cells":[1,2,3,4,5,6,7,8,9,10]}},atlasId:"Bat_Atlas",atlasUrl:"media/models/Bat_.json"},
		"Bat4":		 	{"w":1,"mode":"hi","y":4,"s":1.5,"type":"wall",name:"Bat_",gridSize:1,animDef:{"default":{"loop":true,"cells":[1,2,3,4,5,6,7,8,9,10]}},atlasId:"Bat_Atlas",atlasUrl:"media/models/Bat_.json"},
		"Chair1":		{"w":1,"mode":"lo","y":0,"s":4.7,"type":"deck",name:"DeckChair_Up","chain":"Chair1_hit"},
		"Chair1_hit":	{"w":1,"mode":"lo","y":0,"s":4.7,"type":"hit",name:"DeckChair_Hit"},
		"Chair2":		{"w":1,"mode":"lo","y":0,"s":4.7,"type":"deck",name:"DeckChair_Witch_Up","chain":"Chair2_hit"},
		"Chair2_hit":	{"w":1,"mode":"lo","y":0,"s":4.7,"type":"hit",name:"DeckChair_Witch_Hit"},
		"Chair3":		{"w":1,"mode":"lo","y":0,"s":4.7,"type":"deck",name:"DeckChair_Up","chain":"Chair3_hit"},
		"Chair3_hit":	{"w":1,"mode":"lo","y":0,"s":4.7,"type":"hit",name:"DeckChair_Hit"},
		"Chair4":		{"w":1,"mode":"lo","y":0,"s":4.7,"type":"deck",name:"DeckChair_Witch_Up","chain":"Chair4_hit"},
		"Chair4_hit":	{"w":1,"mode":"lo","y":0,"s":4.7,"type":"hit",name:"DeckChair_Witch_Hit"},		
		"Door":			{"w":1,"mode":"lo","y":0,"s":5,"type":"door2",name:"Door_Closed"},
		"Door_hit":		{"w":1,"mode":"lo","y":0,"s":5,"type":"doorhit",name:"Door_Hit"},
		"Door_open":	{"w":1,"mode":"lo","y":0,"s":5,"type":"door",name:"Door_Open","chain":"Door_hit"},
		"LifeBoat":		{"w":3,"mode":"hi3d","y":3,"s":6,"type":"deck",name:"lifeboat_Up",model:"life_boat"},
		"Luggage":		{"w":1,"mode":"lo","y":0,"s":5,"type":"wall",name:"Luggage_Up","chain":"Luggage_hit"},
		"Luggage_hit":	{"w":1,"mode":"lo","y":0,"s":5,"type":"hit",name:"Luggage_Hit"},
		"Zombie":		{"w":1,"mode":"lo","y":0,"s":5,"type":"wall",name:"ZombiePorter_Up",
						 "chain":"Zombie_hit",sound:"Cruise_ZombieHit"},
		"Zombie_hit":	{"w":1,"mode":"lo","y":0,"s":5,"type":"hit",name:"ZombiePorter_Hit"},
		"Luggage1":		{"w":1,"mode":"lo","y":0,"s":5,"type":"wall",name:"Luggage_Up","chain":"Luggage1_hit"},
		"Luggage1_hit":	{"w":1,"mode":"lo","y":0,"s":5,"type":"hit",name:"Luggage_Hit"},
		"Zombie1":		{"w":1,"mode":"lo","y":0,"s":5,"type":"wall",name:"ZombiePorter_Up","chain":"Zombie1_hit"},
		"Zombie1_hit":	{"w":1,"mode":"lo","y":0,"s":5,"type":"hit",name:"ZombiePorter_Hit"},
		"Lamp":			{"w":1,"mode":"hi3d","y":3,"s":2,"type":"wall",name:"HangingLight",model:"hanging_light"},
		"float1":		{"w":3.5,"mode":"fl","y":-1,"s":4,"type":"pool",name:"Float"},
		"float2":		{"w":3.5,"mode":"fl","y":-1,"s":4,"type":"pool",name:"Float"},
		"float3":		{"w":3.5,"mode":"fl","y":-1,"s":4,"type":"pool",name:"Float"},	
		"float4":		{"w":3.5,"mode":"fl","y":-1,"s":4,"type":"pool",name:"Float"},
		"float5":		{"w":3.5,"mode":"fl","y":-1,"s":4,"type":"pool",name:"Float"},
		"float6":		{"w":3.5,"mode":"fl","y":-1,"s":4,"type":"pool",name:"Float"},
		"float7":		{"w":3.5,"mode":"fl","y":-1,"s":4,"type":"pool",name:"Float"},
		"float8":		{"w":3.5,"mode":"fl","y":-1,"s":4,"type":"pool",name:"Float"},
		"float9":		{"w":3.5,"mode":"fl","y":-1,"s":4,"type":"pool",name:"Float"},
		"float10":		{"w":3.5,"mode":"fl","y":-1,"s":4,"type":"pool",name:"Float"},
		"float11":		{"w":3.5,"mode":"fl","y":-1,"s":4,"type":"pool",name:"Float"},
		"float12":		{"w":3.5,"mode":"fl","y":-1,"s":4,"type":"pool",name:"Float"}
	}
};

var playerParams = {
	1: {
		id: "Drac",
		lives: 4,
		refillRate: 0.01,
		dischargeRate: 0.05,
		gravity: -0.01,
		jumpImpulse: 0.3,
		health: 4,
		moveRate: -0.25,
		jumpMoveRate: -0.25,
		brakeMoveRate: -0.15,
		baseY: 3.7,
		baseZ: 5,
		runSound: "Cruise_DracRun",
		specialSound: "Cruise_DracSpecial",
		duckSound: "Cruise_Slide"
		
	},
	2: {
		id: "Mavis",
		lives: 3,
		refillRate: 0.0125,
		dischargeRate: 0.0125,
		gravity: -0.01,
		jumpImpulse: 0.3,
		health: 3,
		moveRate: -0.28,
		jumpMoveRate: -0.3,
		brakeMoveRate: -0.2,
		baseY: 5,
		baseZ: 5,
		runSound: "Cruise_MavisRun",
		specialSound: "Cruise_MavisSpecial",
		duckSound: "Cruise_Slide"
	},
	3: {
		id: "Frank",
		lives: 6,
		refillRate: 0.01,
		dischargeRate: 0.05,
		gravity: -0.01,
		jumpImpulse: 0.34,
		health: 6,
		moveRate: -0.12,
		jumpMoveRate: -0.20,
		brakeMoveRate: -0.04,
		baseY: 5.4,
		baseZ: 9,
		runSound: "Cruise_FrankRun",
		specialSound: "Cruise_FrankSpecial",
		duckSound: "Cruise_Slide"

	},
	4: {
		id: "Murray",
		lives: 3,
		refillRate: 0.0075,
		dischargeRate: 0.0075,
		gravity: -0.012,
		jumpImpulse: 0.32,
		health: 3,
		moveRate: -0.18,
		jumpMoveRate: -0.18,
		brakeMoveRate: -0.12,
		baseY: 3.7,
		baseZ: 7,
		runSound: "Cruise_MurrayRun",
		specialSound: "Cruise_MurraySpecial",
		duckSound: "Cruise_Slide"
	}
};

