// Generic random Interger function


var halfPi = Math.PI/2;
function Atlas() {
	var me = this;
	me.numLoadTries = 0;
	var atlasDef = undefined;
	var jsonAtlasReady = false;
	// Ideally another load case would be added to the THREEJS loader in blit tools for loading JSON into an object
	this.loadJSON = function(id, url) {
		if (oMODELS[id]!==undefined) {
			me.initJSONAtlas( oMODELS[id] );
		} else {
			
			var xmlhttp = new XMLHttpRequest();
			xmlhttp.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					var txt = this.responseText.replace(/\n/g,"").replace(/\r/g,"").replace(/\t/g,"");

					var myArr = JSON.parse(txt);
					oMODELS[id] = myArr;
					me.initJSONAtlas( myArr );
				} else {
					if (this.readyState===4 && this.status > 0){
						trace("Loading Error:"+url+" "+this.status);
						if (me.numLoadTries++<6) me.loadJSON(id,url);
						//me.loadJSON(id, url);
					}
				}
			};
			xmlhttp.open("GET", url, true);
			xmlhttp.send();
			return false;
		}
	}
	this.initJSONAtlas = function(json) {
		jsonAtlasReady = true;
		me.animated = true;
		var anim={};
		var frameNum = 1;
		var frames = json["frames"];
		var keys = Object.keys(frames);
		var texSize = json.meta.size;
		for(var i=0; i< keys.length; i++){
			var item = frames[keys[i]];
			var frame=item.frame;
			frame.nx = frame.x/texSize.w;
			if (item.rotated) {
				frame.ny = 1-((frame.y+frame.w)/texSize.h);
				frame.nw = frame.h/texSize.w;
				frame.nh = frame.w/texSize.h;
				frame.sw = frame.h*1.0/item.sourceSize.h;
				frame.sh = frame.w*1.0/item.sourceSize.w;
				
				frame.center= new THREE.Vector2(
					((item.spriteSourceSize.x+item.spriteSourceSize.w/2.0)-item.sourceSize.w/2)/item.sourceSize.w,
					-((item.spriteSourceSize.y+item.spriteSourceSize.h/2.0)-item.sourceSize.h/2)/item.sourceSize.h);
			} else {
				frame.ny = 1-((frame.y+frame.h)/texSize.h);
				frame.nw = frame.w/texSize.w;
				frame.nh = frame.h/texSize.h;
				frame.sw = frame.w*1.0/item.sourceSize.w;
				frame.sh = frame.h*1.0/item.sourceSize.h;
				
				frame.center= new THREE.Vector2(
					((item.spriteSourceSize.x+item.spriteSourceSize.w/2.0)-item.sourceSize.w/2)/item.sourceSize.w,
					-((item.spriteSourceSize.y+item.spriteSourceSize.h/2.0)-item.sourceSize.h/2)/item.sourceSize.h);
			}
			//trace(keys[i]+"  "+frame.center.x+","+frame.center.y);
			//frame.center= new THREE.Vector2(
			//	((item.spriteSourceSize.x+item.spriteSourceSize.w/2)-item.sourceSize.w/2)/item.sourceSize.w,
			//	((item.spriteSourceSize.y+item.spriteSourceSize.h)-item.sourceSize.h/2)/item.sourceSize.h);
			frame.rotated=item.rotated;
			anim[frameNum] = frame;
			frameNum++;
		}
		atlasDef = anim;
		me.maxAtlas = frameNum-1;
		me.setCell(me.curDef[0]);
	}
	this.Init = function(id, gridh, animDef, atlasId, atlasUrl) {
		var texture = me.texture = oMODELS[id];

		me.baseScale = 2*gridh;
		texture.generateMipmaps=false;
		texture.magFilter = THREE.NearestFilter;
		texture.minFilter = THREE.NearestFilter;
		//texture.wrapS     = THREE.RepeatWrapping;
		//texture.wrapT     = THREE.RepeatWrapping;
		me.animDef = animDef;
		me.animating = false;
		me.looping = false;
		var hScale = 1;
		if (animDef===undefined) {
			me.animated = false;
			me.animating = true;
			me.animNames = ["default"];
			me.curDef = [1];
			me.offsets = [[0,1]];
			hScale = texture.image.width*1.0/texture.image.height;
			// Scale sprite H based on W
		} else {
			texture = texture.clone();
			me.animated = true;
			me.animNames= Object.keys(animDef);
			me.curDef = animDef[me.animNames[0]].cells;
			var offsets = [];
			texture.matrixAutoUpdate=true;
			texture.needsUpdate = true;
			me.offsets = offsets;
		}
		//me.material = new THREE.SpriteMaterial({map: texture, fog:false, flatShading:true,  transparent:true});
		//me.sprite = new THREE.Sprite(me.material);
		
		me.material = new THREE.MeshBasicMaterial({
			name:id+ "_mat", 
			transparent:true, 
			map:texture, 
			side:THREE.FrontSide,
			depthWrite: false
		});
		oMODELS[id+ "_mat" ] = me.material;
		var plane = new THREE.PlaneGeometry(hScale,1,8,8);

		me.sprite = new THREE.Mesh( plane , me.material );
		
		me.sprite.name = id + "_plane"; 
		
		if ( atlasId!==undefined ) {	
			me.loadJSON(atlasId,atlasUrl);
		}
		me.setCell(me.curDef[0]);
		return me.sprite;
	}
	this.startAnim = function( animName, callback, callbackParam ) {
		//trace("setAnim:"+animName);
		if (me.testCellNum!==undefined) return;
		if (animName===undefined) return;
		if (me.animNames.indexOf(animName)===-1) {
			trace("Missing Anim"+animName);
			return;
		}
		if (me.animated) {
			me.curDef = me.animDef[animName].cells;
			me.loop = me.animDef[animName].loop;
		}
		me.numFrames = me.curDef.length;
		me.currentAnim = animName;
		me.frameNum = 0;
		me.updateTime = 0;
		me.cellNum = me.curDef[0];
		me.animating = me.animated;
		me.animCallback = callback;
		me.animCallbackParam = callbackParam;
		me.animChain = (me.animDef[animName].chain!==undefined)?me.animDef[animName].chain:"";
		me.updateTime = Date.now()+42;
		me.setCell ( me.cellNum );
	}
	this.setCell = function(cellNum) {
		if (jsonAtlasReady) {
				var tFrame = atlasDef[cellNum];
			if (tFrame===undefined) {
				console.log("Missing frame:"+cellNum);
				me.sprite.position.y = -100;
				return;
			}
			if (me.displayCell!==cellNum) {
				me.displayCell = cellNum;
				//Use Atlas Json data to configure this animation frame
				me.material.map.offset.set(tFrame.nx,tFrame.ny);
				me.material.map.repeat.set(tFrame.nw,tFrame.nh);
				me.sprite.scale.set(me.baseScale*tFrame.sw ,me.baseScale*tFrame.sh ,1);

				me.sprite.rotation.z = tFrame.rotated?halfPi:0;
				//me.material.map.needsUpdate = true;
				
			} 
			me.sprite.position.x += tFrame.center.x*me.baseScale;
			me.sprite.position.y += tFrame.center.y*me.baseScale;
			
		} else {
			me.sprite.position.y = -100;
		}
	}
	this.stepAnimation = function() {
		if (me.animating) {
			if (Date.now()>me.updateTime) {
				me.updateTime = Date.now()+42;
				me.frameNum++;	
				if (me.frameNum>=me.numFrames) {
					if (me.loop) {
						me.frameNum = 0;
					} else {
						if (me.animChain!=="") {
							me.startAnim(me.animChain);
						} else {
							me.frameNum = me.numFrames-1;
							me.animating= false;
							if (me.animCallback!==undefined) {
								me.animCallback();
								me.animCallback = undefined;
							}
						}
					}
				}
			}
			me.setCell( me.curDef[me.frameNum] );
		}
	}
}
function RadialMask(tImage,tLevel, tAngle) {
	if (tAngle===undefined) tAngle = 0;
	return new THREE.ShaderMaterial({
		transparent:true,
	 uniforms: {
		 "tDiffuse": { type:"t", value: tImage },
		 "tLevel": { type:"f", value: tLevel},
		 "tAngle": { type:"f", value: tAngle},
	 },
	 vertexShader: [
		 "varying vec2 vUv;", 
		 "void main() {",
		 "vUv = uv;",
		 "gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
		 "}"
	 ].join("\n"),
	 fragmentShader: [
		 "uniform sampler2D tDiffuse;",
		 //"uniform sampler2D tMask;",
		 "uniform float tLevel;",,
		 "uniform float tAngle;",
		 "varying vec2 vUv;",
		"void main() {",
		 // get the current pixel color
			 "vec4 texel = texture2D(tDiffuse, vUv);",
			 "float angle = tAngle+0.5+atan(0.5-vUv.y,vUv.x-0.5)/6.283;",
			 "if (angle>1.0) angle=angle-1.0;",
			 "float alpha = 0.0;",
			 "if (angle<tLevel ) alpha=1.0;", 
			 "gl_FragColor = texel * alpha;",
		 "}"
	 ].join("\n")
});
}

// Minor Utilities
function padZero(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function rndInt(val) {
	return Math.floor(Math.random()*val);
}

/*
// ==ClosureCompiler==
// @compilation_level SIMPLE_OPTIMIZATIONS
// @output_file_name game_min.js
// @code_url http://lbgdev.biz/Client/htcruise/js/panel_legal.js
// @code_url http://lbgdev.biz/Client/htcruise/js/panel_controls.js
// @code_url http://lbgdev.biz/Client/htcruise/js/panel_pause.js
// @code_url http://lbgdev.biz/Client/htcruise/js/screen_loading.js
// @code_url http://lbgdev.biz/Client/htcruise/js/screen_title.js
// @code_url http://lbgdev.biz/Client/htcruise/js/screen_instructions.js
// @code_url http://lbgdev.biz/Client/htcruise/js/screen_picker.js
// @code_url http://lbgdev.biz/Client/htcruise/js/screen_game.js
// @code_url http://lbgdev.biz/Client/htcruise/js/screen_recap.js
// @code_url http://lbgdev.biz/Client/htcruise/js/atlas.js
// @code_url http://lbgdev.biz/Client/htcruise/js/touch.js
// @code_url http://lbgdev.biz/Client/htcruise/js/game.js
// @code_url http://lbgdev.biz/Client/htcruise/js/init.js
// ==/ClosureCompiler==

*/