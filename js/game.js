//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//----- game -----
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
var animations;
var document_blurred=false;
var Game = function(tCharacter){

	window.focus();
	//enableGameTouches();
	var me = this;
	
	// AHK delta
	var playerId = tCharacter;
	me.pieceWidth=20;
	me.shipPieces = [];
	me.moveRate = -0.25;//-0.15;
	me.shipPos	= 0;
	me.nextPiece= -me.pieceWidth;
	me.characterNum = 0; //Drac
	var leftEdge = -me.pieceWidth*2;
	var foregroundPieces = false;
	// end delta
		
	var score_holder;
	var powerup_holder;
	var health_holder;

	me.score = 0;
	me.level = 1;
	me.difficulty = 0;
	me.is_paused = false;
	me.effectiveMoveRate = 0;
	var is_playing = false;

	var frame_delta = 0;
	var delta;
	var game_actives = [];
	var ObstacleManager;
	var obstacleSets = {};
	
	var shipBuilder = {}; // Will add allowed obstacles with difficulty parameter to each
	shipBuilder[1]	={id:1,active:false,type:"wall",next:[1,2,4,9,10,12],			mirror:5};//w
	shipBuilder[2]	={id:2,active:false,type:"wall",next:[1,2,4,9,10,12],			mirror:5};//w
	shipBuilder[3]	={id:3,active:false,type:"wall",next:[1,2,4,9,10,12],			mirror:5};//ws
	shipBuilder[4]	={id:4,active:false,type:"wall",next:[1,2,4,9,10,12],			mirror:5};//w
	shipBuilder[5]	={id:5,active:false,type:"deck",next:[3,11,6,8,5,13,14,15,16],	mirror:5};//d
	shipBuilder[6]	={id:6,active:false,type:"pool",next:[7],						mirror:7};// Pool start 
	shipBuilder[7]	={id:7,active:false,type:"pool",next:[3,11,5,13,14,15,16],		mirror:6};// Pool End
	shipBuilder[8]	={id:8,active:false,type:"pool",next:[3,11,5,13,14,15,16],		mirror:8};// Short Pool
	shipBuilder[9]	={id:9,active:false,type:"wall",next:[1,2,4,9,10,12],			mirror:5};//w
	shipBuilder[10]	={id:10,active:false,type:"wall",next:[5,13,14,15,16,6,8],		mirror:5};// we
	shipBuilder[11]	={id:11,active:false,type:"wall",next:[1,2,4,9,10,12],			mirror:5,x:10};//ws
	shipBuilder[12]	={id:12,active:false,type:"wall",next:[5,13,14,15,16,6,8],		mirror:5,x:-10};// we
	shipBuilder[13]	={id:13,active:false,type:"deck",next:[3,11,6,8,5,13,14,15,16],	mirror:13};
	shipBuilder[14]	={id:14,active:false,type:"deck",next:[3,11,6,8,5,13,14,15,16],	mirror:14};
	shipBuilder[15]	={id:15,active:false,type:"deck",next:[3,11,6,8,5,13,14,15,16],	mirror:15};
	shipBuilder[16]	={id:16,active:false,type:"deck",next:[3,11,6,8,5,13,14,15,16],	mirror:16};

	var obstaclePatterns = {};  
	//sets of obstacles which can be used together in an arrangement the is possible to jump or duck through
	//Each set defines 3 obstacles with x offsets inside the piece area.  It also defined next possible obstacle patterns.
	
	var device_tilt = 0;

	var resize_updater, frame_updater;

	game_actives = [];

	LEGAL.doHide();

	__snds.stopSound("music");
	music_playing = null;

	//create canvas
	var canvas_game = document.getElementById("canvas_game");

	var oGAME = {};

	var splash_emitter;
	var cloud_emitter;

	me.left_down = false;
	me.right_down = false;


	//----------------------------
	// init
	//------------------------- --

this.doInit = function () {

	oGAME.renderer = canvas_game.renderer || new THREE.WebGLRenderer({
		canvas: canvas_game,
		antialias: true,
		alpha: false,
		shadows: false
	});

	//3d scene
	oGAME.scene = new THREE.Scene();

	//camera
	oGAME.camera = new THREE.PerspectiveCamera(40, oSTAGE.screen_width / oSTAGE.screen_height, 0.1, 500);
	oGAME.scene.add(oGAME.camera);

	//score holder
	score_holder = new THREE.Group();
	score_holder.position.set(0, 0, -1);
	oGAME.camera.add(score_holder);
	me.doCreateScoreDigits();

	powerup_holder = new THREE.Group();
	powerup_holder.position.set(0, 0, -1);
	oGAME.camera.add(powerup_holder);
	me.doCreatePowerUpMeter(playerId);

	health_holder = new THREE.Group();
	health_holder.position.set(0, 0, -1);
	oGAME.camera.add(health_holder);
	me.doCreateHealthMeter(playerId);

	//lights
	var light = new THREE.AmbientLight(new THREE.Color(.9, .9, .9));
	oGAME.scene.add(light);
	oGAME.masterLight = light;

	//sky
	oGAME.scene.background = oMODELS.sky;
	oMODELS.sky.repeat = new THREE.Vector2((oSTAGE.screen_width / oSTAGE.screen_height) * .25, 1);
	oMODELS.sky.wrapS = THREE.RepeatWrapping;

	//create ship
	oGAME.ship = new THREE.Group();
	oGAME.scene.add(oGAME.ship);

	//add deck
	var idx, deck, foreground;
	me.shipPieces = [];
	for (idx = 1; idx < 13; idx++) {
		oMODELS['Ship_' + padZero(idx, 2)].material.color = new THREE.Color('white');
		deck = oMODELS['Ship_' + padZero(idx, 2)].clone();
		deck.rotateY(Math.PI / 2);
		deck.material.map.minFilter = THREE.LinearMipMapLinearFilter;
		deck.castShadow = false;
		deck.receiveShadow = true;
		if (foregroundPieces) {
			foreground = oMODELS['Ship_0' + shipBuilder[idx].mirror].clone();
			foreground.material.map.minFilter = THREE.LinearMipMapLinearFilter;
			foreground.castShadow = false;
			foreground.receiveShadow = true;
			deck.add(foreground);
			foreground.translateX(-24);
			foreground.translateY(0.05);
			foreground.rotateY(-Math.PI);
		}
		shipBuilder[idx].obj = deck;
	}
	//Make a couple extra deck pieces for filler and start section of game
	var zPos = -me.pieceWidth;
	for (idx = 13; idx < 17; idx++) {
		deck = oMODELS['Ship_05'].clone();
		deck.rotateY(Math.PI / 2);
		deck.material.map.minFilter = THREE.LinearMipMapLinearFilter;
		deck.castShadow = false;
		deck.receiveShadow = true;
		if (foregroundPieces) {
			foreground = oMODELS['Ship_05'].clone();
			foreground.material.map.minFilter = THREE.LinearMipMapLinearFilter;
			foreground.castShadow = false;
			foreground.receiveShadow = true;
			deck.add(foreground);
			foreground.translateX(-24);
			foreground.translateY(0.05);
			foreground.rotateY(-Math.PI);
		}

		shipBuilder[idx].obj = deck;
		shipBuilder[idx].active = true;
		me.shipPieces.push(shipBuilder[idx]);
		oGAME.ship.add(deck);
		deck.translateZ(zPos);
		zPos += me.pieceWidth;
	}

	//add blobby
	oGAME.player = me.doCreatePlayer(playerId);
	oGAME.ship.add(oGAME.player);
	//add splash particle system
	oGAME.particle_group = new SPE.Group({
		texture: {
			value: oMODELS.particle_water
		},
		blending: THREE.AdditiveBlending,
		transparent: true,
		maxParticleCount: 60
	});

	splash_emitter = new SPE.Emitter({
		particleCount: 60,
		duration: 0.5,
		maxAge: {
			value: 1.0
		},
		activeMultiplier: 2.0,
		position: {
			value: new THREE.Vector3(0, 0, 0),
			spread: new THREE.Vector3(1, 1, 1)
		},
		velocity: {
			value: new THREE.Vector3(0, 12, 0),
			spread: new THREE.Vector3(16, 24, 1)
		},
		acceleration: {
			value: new THREE.Vector3(0, -64, 0)
		},
		size: {
			value: [2.0 * oSTAGE.scale, 1.0 * oSTAGE.scale],
			spread: [2.0 * oSTAGE.scale]
		},
		angle: {
			value: [__utils.radFromDeg(0), __utils.radFromDeg(0)]
		}

	});

	oGAME.particle_group.addEmitter(splash_emitter);
	oGAME.scene.add(oGAME.particle_group.mesh);
	
	oGAME.particle_group_cloud = new SPE.Group({
		texture: {
			value: oMODELS.particle_cloud
		},
		blending: THREE.AdditiveBlending,
		transparent: true,
		maxParticleCount: 20
	});
	SPE.valueOverLifetimeLength=3;
cloud_emitter = new SPE.Emitter({
	particleCount: 20,
	duration: 0.5,
	maxAge: {
		value: 1.0
	},
	activeMultiplier: 2.0,
	position: {
		value: new THREE.Vector3(0, 0, 0),
		spread: new THREE.Vector3(3, 3, 3)
	},
	drag: {
		value: 1
	},
	velocity: {
		value: new THREE.Vector3(0,0,0),
		spread: new THREE.Vector3(10,10,1)
	},
	size: {
		value: [2.0 * oSTAGE.scale, 16.0 * oSTAGE.scale],
		spread: [4.0 * oSTAGE.scale]
	},
	opacity: {
		value: [ 1,0 ]

	}

});

	oGAME.particle_group_cloud.addEmitter(cloud_emitter);
	oGAME.scene.add(oGAME.particle_group_cloud.mesh);
	
	
	ObstacleManager = me.doCreateObstacles();
	// Radial Meters

	splash_emitter.disable();
	cloud_emitter.disable();

	me.doUpdateShip(0);

	//camera stuff
	oGAME.camera.position.set(0, 6, 30); //(0, 3.5, 24);
	oGAME.camera.lookAt(new THREE.Vector3(0, 3.5, 0));
	oGAME.renderer.render(oGAME.scene, oGAME.camera);


	me.doResizeUpdate();
	resize_updater = {
		doResizeUpdate: me.doResizeUpdate
	};
	update_queue.push(resize_updater);

	frame_updater = {
		doUpdate: me.doFrameUpdate
	};
	actives.push(frame_updater);

	canvas_game.style.opacity = 1;
	canvas_game.style.display = "block";


	SCREEN.doShowMessage(oLANG.msg_ready, null);

	setTimeout(me.doGo, 2000);

	//me.doGo();
}
	this.doCreateScoreDigits = function(){

		oGAME.score_digits = [];
		var sprite_map, sprite;

		for(var i=0; i<=6; i++){

			sprite_map = new THREE.SpriteMaterial({map: oMODELS.score_digits.clone(), fog:false, flatShading:true,  transparent:true});
			sprite = new THREE.Sprite(sprite_map);

			sprite.material.map.repeat = new THREE.Vector2(.1, 1);
			sprite.material.map.offset = new THREE.Vector2(i * .1, 0);	
			sprite.material.map.needsUpdate = true;

			sprite.center = new THREE.Vector2(0,1);

			sprite.position.set(i * .0575,0, i * .0001);
			sprite.scale.set(.07968 * 0.96, 0.1 * 0.96, 1);
			sprite.renderDepth = 1;

			score_holder.add(sprite);
			oGAME.score_digits.push(sprite);

		}

		me.doUpdateGameScore();
	}

	this.doUpdateGameScore = function(){
		// Center the score inside score_holder
		var i;
		var a = String(me.score).split("");
		var digit = 0;
		for(i=0;i<a.length; i++){
			var score_digit = oGAME.score_digits[digit];
			score_digit.position.x = (i-(a.length/2.0))* .0575;
			score_digit.material.map.offset.x = parseInt(a[i]) * 0.1;
			score_digit.visible=true;
			digit++;        
		}
		for(i = Math.max(2,digit+1); i <= 7; i++){
			var score_digit = oGAME.score_digits[i-1];
			score_digit.visible=false;
		}
	};

	//----------------------------
	// doCreatePowerUpMeter
	//----------------------------
	
	this.doCreatePowerUpMeter = function( id ) {
		
		var sprite_map, sprite;
		powerup_holder.centerX = 108;
		powerup_holder.centerY = 558;
		powerup_holder.radius  = 77;
		var sFactor = 0.00045;
		var elements = [];
		var cssBaseCoords = {  // Adapted from UI PSD file, exported CSS 1156x650 image coordinates
			"PowerIcon" :{
			  image: "PowerIcon1", 		left: 54,  top: 509,  width: 105,  height: 92},
			"PowerEdgeGlow" :{
			  image: "PowerEdgeGlow",  	left: 166,  top: 552,  width: 39,  height: 19, glow: true},
			"PowerButton" :{
			  image: "PowerButton",  	left: 22,  top: 483,  width: 171,  height: 167},
			"PowerMeter" :{
			  image:"PowerMeter",  		left: 1,  top: 462,  width: 212,  height: 188, radialMeter: true},
			"PowerMeterBase" :{
			  image: "PowerMeterBase",  left: 10,  top:471,  width: 195,  height: 179}
		}
		var i = 0;
		var cssKeys = Object.keys(cssBaseCoords);
		cssKeys.forEach (function(s) {
			var o = cssBaseCoords[s];
			oMODELS[o.image].wrapS = oMODELS[o.image].wrapT = THREE.ClampToEdgeWrapping;
			if (o.radialMeter===true){
				o.sprite_map = powerup_holder.meterShader = RadialMask(oMODELS[o.image], 0); 
			} else {
				o.sprite_map = new THREE.MeshBasicMaterial({
					name:o.image+ "_mat", 
					transparent:true, 
					map:oMODELS[o.image], 
					side:THREE.FrontSide
				});
			}
			var plane = new THREE.PlaneGeometry(1,1,1,1);
			o.sprite = new THREE.Mesh( plane , o.sprite_map );
			o.sprite.position.set((o.left-powerup_holder.centerX+o.width/2)*sFactor,(powerup_holder.centerY-o.top-o.height/2)*sFactor, -i * 0.001);
			if (o.radialMeter===true){
				powerup_holder.spriteCenter = new THREE.Vector3((o.left-powerup_holder.centerX+o.width/2)*sFactor,(powerup_holder.centerY-o.top-o.height/2)*sFactor, -i * 0.001);
			}

			if (o.glow===true){
				powerup_holder.meterGlow = o.sprite;
			}
			o.sprite.renderOrder = 10-i;
			o.sprite.scale.set(o.width*sFactor, o.height*sFactor, 1);
			i++;
			powerup_holder.add(o.sprite);
		});
		powerup_holder.cssBaseCoords = cssBaseCoords;
		powerup_holder.chargeUpTiming = 0;
		powerup_holder.doUpdate = function () {
			if (Date.now()>powerup_holder.chargeUpTiming) {
				powerup_holder.chargeUpTiming = Date.now()+84;
				if (!player.powerupTriggered) {
					player.chargeLevel += player.refillRate;
					if (player.chargeLevel > 1) player.chargeLevel = 1;
				} else {
					player.chargeLevel -= player.dischargeRate;
					if (player.chargeLevel<0) {
						player.chargeLevel=0;
						player.powerupTriggered = false;
					}
				}
				powerup_holder.meterShader.uniforms.tLevel.value = (player.chargeLevel/2);
				powerup_holder.meterShader.needsUpdate = true;
				// position the meter glow
				var tRot = Math.PI*player.chargeLevel;
				powerup_holder.meterGlow.rotation.z = -tRot ;
				
				powerup_holder.meterGlow.position.set(
					powerup_holder.spriteCenter.x+(-Math.cos(tRot)*powerup_holder.radius)*sFactor, 
					powerup_holder.spriteCenter.y+(Math.sin(tRot)*powerup_holder.radius)*sFactor,
					powerup_holder.meterGlow.position.z
				);
				
			}
		}
	}
	
	//----------------------------
	// doCreateHealthMeter
	//----------------------------
	
	this.doCreateHealthMeter = function( id ) {
		var offsetAngle = [0,0,1.0/12,1.0/12,1.0/12][id];
		var sprite;
		var centerX = 94;
		var centerY = 94;
		var sFactor = 0.0005;
		var cssBaseCoords;
		switch(id){  // Adapted from UI PSD file, exported CSS 1156x650 image coordinates
			case 1: //Drac
				cssBaseCoords={
					"PowerMeterBase" :{
					  image: "Health_4",  		left: 1,  top: 1,  width: 188,  height: 188, radialMeter: true},
					"PowerMeter" :{
					  image: "Drac_Health",  	left: 1,  top: 1,  width: 188,  height: 188}
				 }
				me.max_health=4;
				break;
			case 2: //Mavis
				cssBaseCoords={
					"PowerMeterBase" :{
					  image: "Health_3",  		left: 1,  top: 1,  width: 188,  height: 188, radialMeter: true},
					"PowerMeter" :{
					  image: "Mavis_Health",  	left: 1,  top: 1,  width: 188,  height: 188}
				 }
				me.max_health=3;
				break;
			case 3: //Frank
				cssBaseCoords={
					"PowerMeterBase" :{
					  image: "Health_6",  		left: 1,  top: 1,  width: 188,  height: 188, radialMeter: true},
					"PowerMeter" :{
					  image: "Frank_Health",  	left: 1,  top: 1,  width: 188,  height: 188}
				 }
				me.max_health=6;
				break;
			case 4: //Murray
				cssBaseCoords={
					"PowerMeterBase" :{
					  image: "Health_3",  		left: 1,  top: 1,  width: 188,  height: 188, radialMeter: true},
					"PowerMeter" :{
					  image: "Murray_Health",  	left: 1,  top: 1,  width: 188,  height: 188}
				 }
				me.max_health=3;
				break;
		}
		var i = 0;
		var cssKeys = Object.keys(cssBaseCoords);
		cssKeys.forEach (function(s) {
			var o = cssBaseCoords[s];
			oMODELS[o.image].wrapS = oMODELS[o.image].wrapT = THREE.ClampToEdgeWrapping;
			if (o.radialMeter===true){
				o.sprite_map = health_holder.meterShader = RadialMask(oMODELS[o.image], 1, offsetAngle); 
			} else {
				o.sprite_map = new THREE.MeshBasicMaterial({
					name:o.image+ "_mat", 
					transparent:true, 
					map:oMODELS[o.image], 
					side:THREE.FrontSide
				});
			}
			var plane = new THREE.PlaneGeometry(1,1,1,1);
			o.sprite = new THREE.Mesh( plane , o.sprite_map );
			o.sprite.position.set((o.left-centerX+o.width/2)*sFactor,(centerY-o.top-o.height/2)*sFactor, -i * 0.001);
			
			o.sprite.renderOrder = 13-i;
			o.sprite.scale.set(o.width*sFactor, o.height*sFactor, 1);
			i++;
			health_holder.add(o.sprite);
		});
		health_holder.cssBaseCoords = cssBaseCoords;
		health_holder.updateHealth = function ( ) {
			health_holder.meterShader.uniforms.tLevel.value = (1.0*player.health/me.max_health);
			health_holder.meterShader.needsUpdate = true;
		}
	}
	
	
	//----------------------------
	// destroy
	//---------------------------


	this.doDestroy = function(){

		game_actives = [];
		oGAME.particle_group.dispose();
	    resize_updater.forget = true;
	    frame_updater.forget = true;
	    
		//clear scene
		if(oGAME.scene){
			while(oGAME.scene.children.length > 0){ 
	    		oGAME.scene.remove(oGAME.scene.children[0]); 
			}
		}
		oGAME.scene = null;

		//fade out
		TweenLite.to(canvas_game, 0.5, {opacity: 0, overwrite:true, onComplete:function(){
			canvas_game.style.display = "none";
		}
		});

		is_active = false;
		GAME = null;
	}


	//---------------------------
	// resize update
	//---------------------------

	this.doResizeUpdate = function(){
		oGAME.scene.background = new THREE.Color('#06355f');
		oGAME.camera.aspect = oSTAGE.screen_width / oSTAGE.screen_height;
		oGAME.camera.updateProjectionMatrix();

		var wrapper_ratio = (oSTAGE.screen_width / oSTAGE.screen_height);
		oMODELS.sky.repeat = new THREE.Vector2(wrapper_ratio * .5, 1);

		oGAME.renderer.setSize(oSTAGE.screen_width, oSTAGE.screen_height);
		//oGAME.renderer.setPixelRatio(__utils.getPixelRatio());

		//set camera to fit 20 units witch at 20 units distance (world center)
		var target_width;
		if(oSTAGE.is_landscape){
			target_width = oCONFIG.landscale_target_width;
		}else{
			target_width = oCONFIG.portrait_target_width;
		}
		oGAME.camera.position.x = -3;

		var cam_dist = 24;
		var renderer_size = oGAME.renderer.getSize();
		var renderer_ratio = renderer_size.width / renderer_size.height;
		var fov = 2 * Math.atan( ( target_width / renderer_ratio ) / ( 2 * cam_dist ) ) * ( 180 / Math.PI ); // in degrees
		oGAME.camera.fov = fov;
		oGAME.camera.updateProjectionMatrix();

 		var vFOV = oGAME.camera.fov * Math.PI / 180;        // convert vertical fov to radians
		var visible_height = 2 * Math.tan( vFOV / 2 ) * 1; // visible height
		var visible_width = visible_height * renderer_ratio;

		var width_pixel_ratio = visible_width / renderer_size.width;
		var height_pixel_ratio = visible_height / renderer_size.height;
		oSTAGE.pixelRatio = width_pixel_ratio;
		
		score_holder.position.set((10 * width_pixel_ratio * oSTAGE.scale), (visible_height * 0.5) - (10 * width_pixel_ratio * oSTAGE.scale), -1);

 		powerup_holder.position.set((-visible_width * 0.5) + (80 * width_pixel_ratio * oSTAGE.scale),(-visible_height * 0.5) + (120 * height_pixel_ratio * oSTAGE.scale),-1);
		health_holder.position.set((-visible_width * 0.5) + (80 * width_pixel_ratio * oSTAGE.scale),(visible_height * 0.5) - (80 * height_pixel_ratio * oSTAGE.scale),-1);
		var extraScale = rangeBetween(2.5,1.3,0.25,2,1.0*window.innerWidth/window.innerHeight);
		powerup_holder.scale.set(extraScale,extraScale,extraScale);
		health_holder.scale.set(extraScale,extraScale,extraScale);
		
		/*if (oSTAGE.is_landscape) {
			powerup_holder.scale.set(2,2,2);
			health_holder.scale.set(2,2,2);
		} else {
			powerup_holder.scale.set(1.8,1.8,1.8);
			health_holder.scale.set(1.8,1.8,1.8);
		}*/

		var scale_y = Math.tan(oGAME.camera.fov * Math.PI / 180 * 0.5) * cam_dist * 2 ;
 		var scale_x = scale_y * oGAME.camera.aspect;

 		oGAME.camera.position.y = Math.max(0, -(15 - (scale_y * .5))) + 3.5;
		oGAME.camera.lookAt.y = oGAME.camera.position.y - 3.5;

		oGAME.renderer.render(oGAME.scene, oGAME.camera);
		//oGAME.scene.background =  oMODELS.sky;
	}
	function rangeBetween(r1,r2,s1,s2,val) {
		// return value Lerp from r1-r2 based on difference of val between s1-s2
		val = Math.min(s2,Math.max(s1,val));
		var delta = (val-s1)/(s2-s1);
		return  delta*(r2-r1) + r1;
	}

	//----------------------------
	// pause
	//---------------------------

	this.doPause = function(){
		me.is_paused = true;
		var pause_buttons = [
			{snd:"snd_click", msg:oLANG.quit, callback:me.doQuit},
			{snd:"snd_click", msg:oLANG.resume, callback:me.doUnPause}
		];
		new PopupPause(pause_buttons);
	}

	this.doUnPause = function(){
		me.is_paused = false;
	}

	this.doQuit = function(){
		__snds.stopSound("music");
		CONTROLS.doHidePause();
		SCREEN = new TitleScreen();
		LEGAL.doShow();
		me.doDestroy();
	}

	
	//----------------------------
	// pause	
	//---------------------------

	this.doPause = function(){
		me.is_paused = true;
		var pause_buttons = [
			{snd:"snd_click", msg:oLANG.quit, callback:me.doQuit},
			{snd:"snd_click", msg:oLANG.resume, callback:me.doUnPause}
		];
		new PopupPause(pause_buttons);
	}

	this.doUnPause = function(){
		me.is_paused = false;
	}

	this.doQuit = function(){
		__snds.stopSound("music");
		CONTROLS.doHidePause();
		SCREEN = new TitleScreen();
		LEGAL.doShow();
		me.doDestroy();
	}

	
	//----------------------------
	// pause
	//---------------------------


	this.doGo = function(){

		trace("GO!");
		
		SCREEN.doShowMessage(oLANG.msg_go, 1);
		clock.start();
		timer_seconds = 0;
		is_playing = true;
		__snds.playSound("music_game_loop", "music", -1, .25);
		CONTROLS.doShowPause();

		me.doNextTilt();
	}
	
	var unlockMessage = 0; // calculated in dogameover and passed along in dogotrecap
	this.doGameOver = function(){
		if (game_mode>0) return;
		//disableGameTouches();
		trace("GAME OVER!");
		__snds.stopSound("running");
		clock.stop();
		SCREEN.doShowMessage(oLANG.msg_gameover, null);
		if (!player.splash) player.setAnim("Stand");
		game_mode=1;
		is_playing = false;
		player.jumping=false;
		player.isFalling=false;
		player.ducking=false;
		player.incy=0;
		
		player.curY = player.baseY;
		player.playerSprite.position.set(player.curX, player.curY, player.baseZ);
		
		var MurrayAvailable = (oUSER.char1>0)&&(oUSER.char2>0 ||oUSER.char4>0) || (oUSER.char2>0)&&(oUSER.char1>0 ||oUSER.char4>0);
		var FrankAvailable = Math.max(oUSER.char1, oUSER.char2,oUSER.char3, oUSER.char4)>500;
		
	    oUSER.best_score = Math.max(oUSER.best_score, me.score);
		oUSER[ "char"+playerId ]=Math.max(oUSER[ "char"+playerId ],me.score);
	    __localsaver.doSaveData("user", oUSER);
		
		var MurrayAvailable2 = (oUSER.char1>0)&&(oUSER.char2>0 ||oUSER.char4>0) || (oUSER.char2>0)&&(oUSER.char1>0 ||oUSER.char4>0);
		var FrankAvailable2 = Math.max(oUSER.char1, oUSER.char2,oUSER.char3, oUSER.char4)>500;
		
		unlockMessage = (!FrankAvailable && FrankAvailable2)?1:0;
		unlockMessage += (!MurrayAvailable && MurrayAvailable2)?2:0;

		__snds.playSound("music_game_end", "music", 1, 0.25);
		CONTROLS.doHidePause();
		setTimeout(me.doGotoRecap, 3000);
	}

	this.doGotoRecap = function(){
		SCREEN = new RecapScreen(unlockMessage);
		LEGAL.doShow();
		me.doDestroy();
	}
	
	//----------------------------
	// Ship piece generation
	//----------------------------
	
	this.doUpdateShip = function(movement){
		me.shipPos += movement;
		var tScore = Math.floor(Math.abs(me.shipPos/3));
		if (me.score!==tScore && game_mode===0 ) {
			me.score = tScore;
			me.doUpdateGameScore();
		}
		oGAME.ship.position.x = me.shipPos;
		if (game_mode===0) 
			oGAME.player.position.x = -me.shipPos-7;
		var oGround = player.ground;
	
		player.ground = 0;
		if ( this.shipPieces[1].id===6 ) {
			player.ground = -1;
		}
		if ( this.shipPieces[1].id===7 || this.shipPieces[1].id===8 ) {
			player.ground = (this.shipPieces[1].obj.position.x + me.shipPos < -13)?0:-1;
		}
		
		if (oGround !== player.ground) {
			trace("ground switch:"+player.ground);
			if ( player.ground<0 && !player.jumping ) {
				player.jumping=true;
				player.incy = 0;
			} else {
				player.curY=Math.max(player.baseY,player.curY);
			}
		}
		// Remove old ship sections
		if (this.shipPieces[0].obj.position.x+me.shipPos<leftEdge) {
			oGAME.ship.remove(this.shipPieces[0].obj);
			this.shipPieces[0].active=false;
			this.shipPieces.splice(0,1);
			// Pick a new object to stick on the right
			var rObj = this.shipPieces[this.shipPieces.length-1];
			var nextPieces = rObj.next.concat([]);// Make sure the list is a copy
			var nextIdx = rndInt(Math.max(1, nextPieces.length-1));
			var nextId = nextPieces[nextIdx];
			var failout = 100;
			while (((me.score<150 && nextId===6 )||this.shipPieces.indexOf(shipBuilder[nextId])>-1) && failout-->0 ){
				nextPieces.splice(nextIdx,1);
				nextPieces.push(nextId);	
				nextIdx = rndInt(Math.max(1,nextPieces.length-1));
				nextId = nextPieces[nextIdx];
			}			  
			shipBuilder[nextId].active=true;
			//trace("Piece Populate:"+nextId);
			this.shipPieces.push(shipBuilder[nextId]);
			var piece = shipBuilder[nextId].obj;
			oGAME.ship.add(piece);
			piece.position.x = rObj.obj.position.x+this.pieceWidth;
			piece.position.z = rObj.obj.position.z;

			var tType = shipBuilder[nextId].type; // wall, deck, pool determine possible obstacles
			var tObjs = obstacleSets[tType];
			if (tObjs!==undefined && tObjs.length>0) {
				var obsPlace = 0;
				if (nextId==1) {
					tObjs = tObjs.concat(obstacleSets["door"]);
				} else {
					tObjs = tObjs.concat([]);
				}
				var obCount = (0.4+me.score*.02)>Math.random()?1:0;
				var xJitter = Math.min(me.score*.02,8);
				var obSpace=0;
				xJitter = Math.random()*xJitter-(xJitter/2);
				if ( nextId===6 ) {
					obsPlace = -4.5;
					obCount=2;
					obSpace=10;
				}
				if ( nextId===7 ) {
					obsPlace = -4.5;
					obCount=2;
					obSpace=10;
				}
				if ( nextId===8 ) {
					obsPlace = 0;
					obCount=1;
					obSpace=10;
				}
				if (obCount==1 && me.score>100) {
					obCount = (me.score*.001)>Math.random()?2:1;
					if (obCount>1){
						xJitter-=2;
						obSpace=4;
					}
				}
				var placement = piece.position.clone();
				var firstType = "";
				while ( obCount-- > 0 ) {
					if (shipBuilder[nextId].x!==undefined){
						placement.x+=shipBuilder[nextId].x;
						
					}
					var tObj = tObjs[rndInt(tObjs.length)];
					while ( tObj.active && tObjs.length>1 ) {
						tObjs.splice(tObjs.indexOf(tObj),1);
						tObj = tObjs[rndInt(tObjs.length)];
					}
					firstType = tObj.mode;
					if (!tObj.active){
						if (tObj.type==="door"){
							
							ObstacleManager.init(
								tObj,
								new THREE.Vector3(piece.position.x,4.88,piece.position.z+2.26),
								9.5,//1.3*tObj.s,
								placement
							);
						} else {
							//trace("Generate:"+tObj.id);
							ObstacleManager.init(
								tObj,
								new THREE.Vector3(xJitter+piece.position.x+obsPlace,tObj.y+0.5+tObj.s/2,player.baseZ+0.2),
								1.3*tObj.s,
								placement
							);
							obsPlace+=obSpace;
						}
					}
					if (tObj.is3D) {
						break;
					} else {
						for (var idx =  tObjs.length-1; idx>=0; idx--) {
							if (tObjs[idx].is3D || tObjs[idx].mode!==firstType ) {
								tObjs.splice(idx,1);
							}
						}
					}
				}
			}
		}
	};

	//----------------------------
	// player
	//---------------------------
	var player;
	this.doCreatePlayer = function( playerNum ){
		
		player = new THREE.Group();	
		player.incy = 0;
		player.curX = player.targetX = 0;
		player.jumping = false;
		player.ducking = false;
		player.splash  = false;
		player.powerupTriggered = false;
		player.chargeLevel = 0;
		player.resetting   = false;
		player.ground = 0;
		
		player.animation = new Atlas();
		
		player.lives 		= player.baseLives 	= playerParams[playerNum].lives;
		player.refillRate 	= playerParams[playerNum].refillRate;
		player.dischargeRate= playerParams[playerNum].dischargeRate;
		player.gravity 		= playerParams[playerNum].gravity;
		player.jumpImpulse 	= playerParams[playerNum].jumpImpulse;
		player.health 		= playerParams[playerNum].health;
		me.moveRate 		= me.baseMoveRate 	= playerParams[playerNum].moveRate;
		player.jumpMoveRate = playerParams[playerNum].jumpMoveRate;
		player.brakeMoveRate = playerParams[playerNum].brakeMoveRate;
		player.baseY 		= player.curY 		= playerParams[playerNum].baseY;
		player.baseZ 		= playerParams[playerNum].baseZ;
		player.runSound		= playerParams[playerNum].runSound;
		player.duckSound	= playerParams[playerNum].duckSound;
		player.specialSound	= playerParams[playerNum].specialSound;
		
		player.playerSprite = player.animation.Init(
			playerParams[playerNum].id+"_", 
			player.baseY, 
			animations[playerParams[playerNum].id],
			playerParams[playerNum].id+"_Atlas",
			"media/models/"+playerParams[playerNum].id+"_.json"
		);
		
		player.animation.startAnim("Run");
		player.add(player.playerSprite);
		//playerSprite.rotateY(Math.PI);
		player.playerSprite.position.set(player.curX, player.baseY, player.baseZ);
		player.playerSprite.scale.set( player.baseY*2, player.baseY*2, 1 );
		player.playerSprite.doubleSided = true;
		player.playerSprite.renderOrder = 1;
		player.isFalling = false;
		player.immuneTime = 0;
		
		player.doUpdate = function(){
			if (game_mode>0) {
				player.animation.stepAnimation();
				return;
			}
			if (player.splash) {
				//splash_emitter.disable();
				me.moveRate*=.95;
			} else {
				player.curX = player.curX*0.975+player.targetX*0.025;
				if (player.jumping) {
					me.moveRate = player.jumpMoveRate;
					player.curY += player.incy;
					player.incy +=player.gravity;
					//console.log(player.animation.currentAnim+" "+player.incy);
					switch (player.jumpPhase){
						case 0:
							player.jumpPhase=1;
							//player.setAnim("JumpUp");
							break;
						case 1:
							if (player.incy<0.1) {
								player.jumpPhase=2;
								//player.setAnim("JumpInAir");
							}
							break;
						case 2:
							if (player.incy<-0.1) {
								player.jumpPhase=3;
								//player.setAnim("JumpDown");
							}
							break;
					}
					if (player.curY<player.baseY+player.ground && player.incy<0) {
						player.curY=player.baseY+player.ground;
						player.setAnim("Land");
						player.jumping= false;
						player.restarting=false;
						me.moveRate = me.baseMoveRate;
					} 
					player.playerSprite.position.set(player.curX, player.curY, player.baseZ);

				} else {
					player.playerSprite.position.set(player.curX, player.curY, player.baseZ);
					if ( player.ground<0 && !player.onFloatie && !player.restarting ) {
						player.splash=true;
						player.jumping=false;
						player.setAnim("Splash");
						player.hit();
						splash_emitter.position.value= new THREE.Vector3(-7,0,0);
						splash_emitter.enable();
					}
				}
			}
			player.animation.stepAnimation();
		};
		player.setAnim = function(animName) {
			if (game_mode!==0) return;
			if (player.animation.currentAnim!==animName) player.animation.startAnim(animName);
		};
		player.jump = function() {
			player.ducking=false;
			player.jumping = true;
			player.jumpPhase = 0;
			player.curY = player.baseY;
			player.incy = player.jumpImpulse;
		};
		player.hit = function() {
			if (Date.now()>player.immuneTime) {
				player.immuneTime=Date.now()+1000;
				player.ducking = false;
				player.powerupTriggered=false;
				player.targetX=0;
				player.health--;
				if (player.health<=0) {
					me.doGameOver();
				} else {

				}
				health_holder.updateHealth();
			}
		}
		player.restartPlayer = function( water ){  // This is the player coming out of water
			if (!player.restarting){
				player.restarting = true;
				player.curX -=6;
				player.curY = player.baseY;
				player.jumping = true;
				player.ducking=false;
				powerupTriggered=false;
				player.incy = player.jumpImpulse;
				player.splash = false;
				player.setAnim("JumpStart");
				splash_emitter.position.value= new THREE.Vector3(-10,0,0);
				splash_emitter.enable();
			}
		}
		game_actives.push(player);

		return player;
	}

	// Obstacle library, limted number of obstacles drawing graphics from a single Atlas.
	
	this.doCreateObstacles = function() {
		// three potential obstacles per section, 12 total? Maybe too many.
		
		this.objs = [];
		var minime = this;
		this.curObject = 0;
		obstacleSets = {};
		var sourceDefs = animations["Obstacles"];
		var objKeys = Object.keys(sourceDefs);
		this.numObjs = objKeys.length;
		objKeys.forEach( function(key){
			var tObj = sourceDefs[key];
			if (tObj.chain===undefined) tObj.chain="";
			tObj.is3D = tObj.model !== undefined;
			tObj.hittable = tObj.is3D || (tObj.chain!=="") || tObj.atlasId!==undefined;
			if (tObj.is3D) {
				tObj.obj = oMODELS[tObj.model].clone();
				tObj.obj.rotateY(Math.PI/2);
				tObj.obj.material.map.minFilter = THREE.LinearMipMapLinearFilter;
				tObj.obj.material.color=new THREE.Color('white');
				tObj.obj.castShadow = false;
				tObj.obj.receiveShadow = false;
				tObj.isAnimated = false;
			} else {
				tObj.atlas = new Atlas();
				var atlasSize = tObj.gridSize || 1; 
				if (tObj.atlasId!==undefined) {
					tObj.sprite = tObj.atlas.Init(tObj.name, tObj.s, tObj.animDef, tObj.atlasId, tObj.atlasUrl);
					tObj.atlas.startAnim("default");
					tObj.isAnimated = true;
				} else {
					tObj.sprite = tObj.atlas.Init(tObj.name, atlasSize);
					tObj.isAnimated = false;
				}
				tObj.sprite.center = new THREE.Vector2(0.5,0);
				tObj.sprite.renderOrder = (tObj.type==="door"||tObj.type==="doorhit")?0:4;
			}
			tObj.id = key;
			if (obstacleSets[tObj.type] === undefined) {
				obstacleSets[tObj.type] = [sourceDefs[key]];
			} else {
				obstacleSets[tObj.type].push(sourceDefs[key]);
			}
			tObj.active = false;
			minime.objs.push(tObj);
		});
	
		this.init = function(animObj, loc, scale, piecePos) {
			var tObj = animObj;
			
			tObj.hitPos = loc;
			tObj.active = true;
			tObj.animationTime = 0;
			if (tObj.is3D) {
				tObj.obj.position.set(piecePos.x,piecePos.y+tObj.y-3,piecePos.z);
				//tObj.hitPos.x += tObj.x;
				//tObj.obj.scale.set(piecePos.x,piecePos.y,piecePos.z);
				oGAME.ship.add(tObj.obj);
			} else {
				tObj.atlas.startAnim();
				tObj.sprite.position.set(loc.x,loc.y,loc.z);
				tObj.sprite.scale.set(scale,scale,scale);
				oGAME.ship.add(tObj.sprite);
			}
		}
		this.doUpdate = function() {
			var tObj;
			player.onFloatie=false;
			for (var idx=0; idx<me.numObjs; idx++) {
				tObj = minime.objs[idx];
				if (tObj.active) {
					var hOffset = Math.abs(tObj.hitPos.x+me.shipPos+7-player.curX);
					if (tObj.mode==="hi3d") trace(tObj.name+"  "+hOffset);
					if (tObj.isAnimated) {
						var tY = tObj.hitPos.y;//Math.max(player.curY,tObj.hitPos.y);
						tObj.sprite.position.set(tObj.hitPos.x,tY,tObj.hitPos.z);
						tObj.atlas.stepAnimation();
					 }
					if (tObj.mode==="fl") {
						if (hOffset<tObj.w) {
							player.onFloatie=true;
							if (player.curY<1) {
								player.jump();
							}
						}
					} else {
						if ( tObj.hittable ) {
							if (tObj.name==="Bat_") {
								if (Date.now()>tObj.animationTime){
									tObj.animationTime=Date.now()+42;
									tObj.hitPos.x-=0.001*me.score;
								}
							}
							var playerIsHit = false;
							if (hOffset<tObj.w ||(playerId===1&&player.powerupTriggered&&hOffset<10) && game_mode===0) {
								
								switch (tObj.mode) {
									case "ta":
										if (!(player.jumping&&player.curY>tObj.sprite.position.y+3)) { 
											playerIsHit=true;
										}
										break;
									case "lo":
										if (!player.jumping) playerIsHit=true;
										break;
									case "hi":
										if (!player.ducking && !(player.jumping&&player.curY>tObj.sprite.position.y+2)) { 
											playerIsHit=true;
										}
										break;
									case "hi3d":
										if (!player.ducking) { 
											playerIsHit=true;
										}
										break;
									case "fl":
										
										break;
								}
								if (playerIsHit) {
									if (!player.powerupTriggered) {
										//trace("Player hit: "+tObj.id);
										player.hit();
										player.isFalling = true;
										player.setAnim("FallAndUp");
									}
									
									cloud_emitter.position.value= new THREE.Vector3(-7,3,0);
									cloud_emitter.enable();
									if (tObj.is3D) {
										//oGAME.ship.remove(tObj.obj);
										tObj.obj.position.y+=0.5;
									} else {
										if (tObj.chain!=="") {
											var sndName = "Cruise_Hit";
											if (tObj.sound!==undefined) {
												sndName = "Cruise_ZombieHit";
											} 
											
											__snds.playSound(sndName, "sfx", 1, 0.25);
											if (tObj.type=="door"){
												minime.init(
													sourceDefs[tObj.chain],
													tObj.sprite.position,//new THREE.Vector3(piece.position.x,4.88,piece.position.z+2.26),
													9.5//,//1.3*tObj.s,
													//placement
												);
											} else {
												minime.init(sourceDefs[tObj.chain],tObj.sprite.position,tObj.sprite.scale.x);
											}
										}
										oGAME.ship.remove(tObj.sprite);
									}
									tObj.active = false;
								}
							}
						}
					}
					if (tObj.is3D) {
						if (tObj.obj.position.x+me.shipPos<leftEdge) {
							tObj.active = false;
							oGAME.ship.remove(tObj.obj);
						}
					} else {
						if (tObj.sprite.position.x+me.shipPos<leftEdge) {
							tObj.active = false;
							oGAME.ship.remove(tObj.sprite);
						}
					}
				}
			}
		}
		game_actives.push(minime);
		return this;
	}
	//---------------------------------------------
	//---------------------------------------------
	//---------------------------------------------
	//---------------------------------------------

	var frame_counter = 0;
	var current_tilt = 0;
	var next_tilt = 0;
	var tilt_speed = 0;
	var current_speed = 0;

	var move_speed = 0;
	var move_factor = 0;

	var game_mode = 0;

	var pulse_12 = new __utils.NewPulse(5, {seed:180});
	var pulse_6 = new __utils.NewPulse(8);
	var pulse_ship = new __utils.NewPulse(2);

	var pulse_ease = 1;
	var game_sequence_id = -1;
	var last_sign = 1;

	var timer_seconds = 0;

	this.doNextTilt = function(){

		if(is_playing){
			game_sequence_id++;
			if(game_sequence_id > game_sequence.length-1){
				game_sequence_id = 0;
			}
			next_tilt = game_sequence[game_sequence_id].amt;
			var sign = next_tilt ? next_tilt<0 ? -1 : 1 : 0;
			tilt_speed = game_sequence[game_sequence_id].speed * sign;
			last_sign = sign;
		}else{
			last_sign *= -1;
			next_tilt = 0.05 * last_sign;
			tilt_speed = 0.002 * last_sign;
		}

	
	}


	//-------------------------
	// frame loop
	//-------------------------

	this.doFrameUpdate = function(){

		frame_delta = clock.getDelta();

		var using_keyboard = false;
		var using_buttons = false;
		var using_tilt = false;

		if(!oGAME.scene){return;}
		if(me.is_paused){return;}

		pulse_ship.update();
		pulse_6.update();
		pulse_12.update();
		if (oGAME.masterLight.intensity>1) {
			if (oGAME.masterLight.intensity>2 && rndInt(10)==3) oGAME.masterLight.intensity =10;
			oGAME.masterLight.intensity = Math.max(1,oGAME.masterLight.intensity*0.8);
			
		} else {
			//if (rndInt(500)==37) oGAME.masterLight.intensity =10;
		}
		oGAME.ship.position.z = -2;
	
		//move up and down
		if (!document_blurred) oGAME.ship.position.y = -2+pulse_ship.value * 1;
		
		switch(game_mode){

			case 99:
				//nothing
				break;

			case 0: //normal play
				if (document_blurred) break;
				if (me.doUpdateShip!==undefined) {
					me.effectiveMoveRate = me.effectiveMoveRate*0.9 + me.moveRate*0.1;
					me.doUpdateShip( me.effectiveMoveRate );

				}
				var powerup_pressed = false;
				if (thisTouch.x>-100) {
					//console.log((__input.mouse_x/window.innerWidth)+"&&"+(__input.mouse_y/window.innerHeight));
					if ( thisTouch.x<-0.6&& thisTouch.y<-0.6) {
						powerup_pressed = true;
					}
				}
				
				if (__input.keys_down.indexOf(65)!==-1) { // a
					game_mode=3;
				}
				if (player.isFalling) {
					if (player.animation.frameNum>=player.animation.numFrames-1) {
						player.isFalling=false;
						me.moveRate = me.baseMoveRate;
						player.jumping=false;
						player.powerupTriggered=false;
						player.ducking=false;
					} else {
						player.powerupTriggered=false;
						player.curY=player.curY*0.9+player.baseY*0.1;
						me.moveRate*=0.95;
						break;
					}
				}
				if (player.splash) {
					if (player.animation.frameNum>3) {
						
						if (__snds.getNowPlaying("running") != "Cruise_Splash")
							__snds.playSound( "Cruise_Splash", "running", 0, 0.5);
						me.moveRate=player.jumpMoveRate;
						if (player.ground>=0) {
							player.restartPlayer(true);
							me.moveRate=me.baseMoveRate;
							me.effectiveMoveRate = 0.01;
						}
					}
					break;
				}
				
				if (__input.space || powerup_pressed) {
					if (player.chargeLevel>0.25 ) {
						
						if (!player.powerupTriggered) {
							__snds.playSound( player.specialSound, "running",-1,0.5);
							if (playerId===2) {
								cloud_emitter.position.value= new THREE.Vector3(-7,3,0);
								cloud_emitter.enable();
							}
							player.powerupTriggered = true;
							player.setAnim("SpecialStart");
						}
					} 
				} else {
					player.powerupTriggered = false;
				}
				powerup_holder.doUpdate();
				var action = player.jumping || player.powerupTriggered;//me.powerup.active || 
				if((__input.up||__lastSwipe===1) && !player.jumping && !player.powerupTriggered){
					player.setAnim("JumpStart");
					
					__snds.playSound( "Cruise_Jump", "running",0,0.5);
					__input.up=false;
					player.jump();
					action=true;
					__lastSwipe=-1;
				}
				
				if((__input.dn||__lastSwipe===3) && !player.powerupTriggered){
					if (player.jumping) {
						player.incy-=0.05;
					} else {
						if (!player.ducking) {
							__snds.playSound( player.duckSound, "running",0,0.5);
							if (!player.powerupTriggered) player.setAnim("Duck");
							player.ducking=true;
						} 
					}
					action=true;
				}
				
				if ((__input.left||__lastSwipe===4)) {
					if (player.animation.currentAnim!=="Brake"&& !player.jumping&&!player.ducking) {
						if (!player.powerupTriggered) player.setAnim("Brake");
					}
					player.targetX = -2;
					me.moveRate = player.brakeMoveRate;
					action=true;
				}
				
				if ((__input.right||__lastSwipe===2))  {
					if (player.animation.currentAnim!=="Run"&& !player.jumping&&!player.ducking) {
						if (!player.powerupTriggered) player.setAnim("Run");
					}
					player.targetX = 2;
					if (player.curX>1.95) player.targetX=0;
					else action=true;
				} 

				if (!action) {
					if (__snds.getNowPlaying("running") != player.runSound)
						__snds.playSound( player.runSound, "running",-1,0.5);
					player.targetX = 0;
					player.ducking=false;
					player.setAnim("Run");
				}
				break;

		case 1: //game over
				
				me.doUpdateShip( -0.15 );
				player.curY = player.baseY;
				me.moveRate*=0.95;
				player.playerSprite.position.set(player.curX, player.curY, player.baseZ);
				player.animation.stepAnimation();
			break;

		case 2: //barf

			break;

		case 3: // Animation testing
				me.moveRate=0;
				
				if (__input.keys_down.indexOf(81)!==-1) { // q
					game_mode=0;
				}
				if (__input.space){
					player.animation.testCellNum=1;
				}
				if (__input.left || __input.right || __lastSwipe==2 || __lastSwipe==4) {
					if (player.animation.animating) {
						player.animation.animating=false;
						player.animation.testCellNum=1;
						player.animation.testCellNextUpdate = Date.now()+500;
						player.playerSprite.position.set(player.curX, player.curY, player.baseZ);
						player.animation.setCell(1);
					} else {
						if (Date.now()>player.animation.testCellNextUpdate){
							
							player.animation.testCellNextUpdate = Date.now()+500;
							if (__input.right || __lastSwipe==2) 		player.animation.testCellNum++; 
							if (__input.left || __lastSwipe==4)       player.animation.testCellNum--;
							if (player.animation.testCellNum<1) {player.animation.testCellNum=player.animation.maxAtlas-1;}
							if (player.animation.testCellNum>=player.animation.maxAtlas) {
								player.animation.testCellNum=1;
							}
							player.playerSprite.position.set(player.curX, player.curY, player.baseZ);
							player.animation.setCell(player.animation.testCellNum);
							__lastSwipe=-1;
						}
					}
					me.score=player.animation.testCellNum;
					me.doUpdateGameScore();
				} 
				

			break;

		case 4:
				

			break;

		}


		//update game actives
		if (document_blurred===false) {
			for(var i=0; i<game_actives.length; i++){
				game_actives[i].doUpdate();
			}

			//move sky
			oMODELS.sky.offset.x += .005;
			oGAME.particle_group.tick(delta);
			oGAME.particle_group_cloud.tick(delta);
		}

		//render
		oGAME.renderer.render(oGAME.scene, oGAME.camera);
		oGAME.scene.background =  oMODELS.sky;
	
	}


	me.doInit();

}