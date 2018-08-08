
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//----- picker screen -----
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

var curTouch={x:-1000,y:-1000}; // 

function PickerScreen() {

	var me = this;
	me.characterNum = -1;
	var msg_timeout;
	var hScroll = 0;
	//---------------------------
	// init
	//---------------------------

	var container = document.getElementById("div_screens");
	__utils.doDestroyAllChildren(container);
	container.style.backgroundColor = "";
	
	
	var pickerElements = {
		"PickerBackground":{type:"group", src:("media/picker/PickerBackground.jpg")},

		"MurrayStats":{type:"group",align:"center"},
		"MurrayBody":{type:"image", src:("media/picker/MurrayBody.png")},
		"MurrayStatsImageBackground":{type:"image", src:("media/picker/DefaultStatsImage.png"),button:"Pick",id:4},
		"MurrayStatsImage":{type:"image", src:("media/picker/MurrayStatsImage.png")},
		"MurrayAbility":{type:"text"},
		"MurrayJump":{type:"text"},
		"MurraySpeed":{type:"text"},
		"MurrayName":{type:"text"},

		"FrankStats":{type:"group",align:"center"},
		"FrankBody":{type:"image", src:("media/picker/FrankBody.png")},
		"FrankStatsImageBackground":{type:"image", src:("media/picker/DefaultStatsImage.png"),button:"Pick",id:3},
		"FrankStatsImage":{type:"image", src:("media/picker/FrankStatsImage.png")},
		"FrankAbility":{type:"text"},
		"FrankJump":{type:"text"},
		"FrankSpeed":{type:"text"},
		"FrankName":{type:"text"},

		"MavisStats":{type:"group",align:"center"},
		"MavisBody":{type:"image", src:("media/picker/MavisBody.png")},
		"MavisStatsImageBackground":{type:"image", src:("media/picker/DefaultStatsImage.png"),button:"Pick",id:2},
		"MavisStatsImage":{type:"image", src:("media/picker/MavisStatsImage.png")},
		"MavisAbility":{type:"text"},
		"MavisJump":{type:"text"},
		"MavisSpeed":{type:"text"},
		"MavisName":{type:"text"},

		"DracStats":{type:"group",align:"center"},
		"DracBody":{type:"image", src:("media/picker/DracBody.png")},
		"DracStatsImageBackground":{type:"image", src:("media/picker/DefaultStatsImage.png"),button:"Pick",id:1},
		"DracStatsImage":{type:"image", src:("media/picker/DracStatsImage.png")},
		"DracAbility":{type:"text"},
		"DracJump":{type:"text"},
		"DracSpeed":{type:"text"},
		"DracName":{type:"text"},
		
		"FrankLockLayer":{type:"group", hide:"Frank",align:"center"},
		"FrankLockImage":{type:"image", src:("media/picker/small_lock.png")},
		"FrankLockText":{type:"text"},

		"MurrayLockLayer":{type:"group", hide:"Murray",align:"center"},
		"small_lock":{type:"image", src:("media/picker/small_lock.png")},
		"MurrayLockText":{type:"text"},

		"PickerBackButtontype": {type:"group"},
		"PickerBackButton":{type:"image", src:("media/picker/PickerBackButton.png"),button:"Back"},
		"PickerBack":{type:"text"},

		"PlayButton":{type:"group"},
		"PickerPlayButton":{type:"image", src:("media/picker/PickerPlayButton.png"),button:"Play"},
		"PickerPlay":{type:"text"},
	};
	
	if (oUSER.char1===undefined) oUSER.char1=-1;
	if (oUSER.char2===undefined) oUSER.char2=-1;
	if (oUSER.char3===undefined) oUSER.char3=-1;
	if (oUSER.char4===undefined) oUSER.char4=-1;
	
	var MurrayAvailable = (oUSER.char1>0)&&(oUSER.char2>0 ||oUSER.char4>0) || (oUSER.char2>0)&&(oUSER.char1>0 ||oUSER.char4>0);
	var FrankAvailable = Math.max(oUSER.char1, oUSER.char2,oUSER.char3, oUSER.char4)>500;
	var availableCharacters = [true,true,true,FrankAvailable,MurrayAvailable];
	
	var subContainer = container;
	var keys = Object.keys(pickerElements);
	keys.forEach(function(key){
		var tObj = pickerElements[key];
		if (tObj.type==="group") {
			subContainer = container.appendChild(document.createElement("div"));
			subContainer.id = subContainer.className = key;
			subContainer.style.pointerEvents="none";
			tObj.element = subContainer;
		} else {
			var elementType = "div";
			if (tObj.button!==undefined){
				elementType="a";
			} 
			var element = subContainer.appendChild(document.createElement("div"));
			tObj.element = element;
			element.id = element.className = key;
			//element = subContainer.appendChild(element);
			element.style.display="block";
			if (tObj.type==="text") {
				__utils.doHTMLText(element, oLANG[key]);
				if (key==="PickerPlay") element.style.opacity=0.5;
			} else {
				element.style.backgroundSize="contain";
				element.style.backgroundImage="url("+(images[key].currentSrc||images[key].src)+")"
			}
			if (tObj.button!==undefined){
				element.style.cursor="pointer";
				element.style.pointerEvents="auto";
				switch (tObj.button){
					case "Back":
						element.onmouseup = function(e){
							sCode.trackGame("cruiseshiprun","back");
							me.doDestroy();
							doFinishLoading(function(){
								SCREEN = new TitleScreen();
							});
							__snds.playSound("snd_click", "interface");
						}
						element.onmouseover= function(e){
							TweenLite.to(e.target, .1, {transform: "scale(1.1, 1.1)", overwrite:true});
						}
						element.onmouseout = function(e){
							TweenLite.to(e.target, .5, {transform: "scale(1.0, 1.0)", overwrite:true, ease: Elastic.easeOut.config(1, 0.5)});
						}
						break;
					case "Play":
						
						element.style.opacity=0.5;
						element.onmouseup = function(e){
							if (me.characterNum>-1) {
								sCode.trackGame("cruiseshiprun","play:"+["Drac","Mavis","Frank","Murray"][me.characterNum-1]);
								me.doDestroy();
								doFinishSecondLoading(me.characterNum, function(){
									SCREEN = new GameScreen();
									GAME = new Game(me.characterNum);
								});
								__snds.playSound("snd_click", "interface");
							}
						}
						element.onmouseover= function(e){
							if (me.characterNum>-1) TweenLite.to(e.target, .1, {transform: "scale(1.1, 1.1)", overwrite:true});
						}
						element.onmouseout = function(e){
							if (me.characterNum>-1) TweenLite.to(e.target, .5, {transform: "scale(1.0, 1.0)", overwrite:true, ease: Elastic.easeOut.config(1, 0.5)});
						}
						break;
					case "Pick":
						if (availableCharacters[tObj.id]) {
							element.characterId = tObj.id;
							element.master = me;
							element.onmouseup = function(e){
								this.master.selectCharacter(this);
								__snds.playSound("snd_click", "interface");
							}
							element.onmouseover= function(e){
								TweenLite.to(e.target, .1, {transform: "scale(1.1, 1.1)", overwrite:true});
							}
							element.onmouseout = function(e){
								TweenLite.to(e.target, .5, {transform: "scale(1.0, 1.0)", overwrite:true, ease: Elastic.easeOut.config(1, 0.5)});
							}
						} else {
							element.style.opacity = 0.75;
						}
						break;
				}
			} else {
				element.style.pointerEvents="none";
			}
		}
	});
	if (MurrayAvailable) pickerElements["MurrayLockLayer"].element.style.display="none";
	if (FrankAvailable) pickerElements["FrankLockLayer"].element.style.display="none";
	
	var previousHighlight = undefined;
	this.selectCharacter = function (buttonElement) {
		if (me.characterNum>-1) {
			previousHighlight.style.backgroundImage="url("+(images["MavisStatsImageBackground"].currentSrc||images["MavisStatsImageBackground"].src)+")";
		}
		previousHighlight = buttonElement;
		buttonElement.style.backgroundImage="url("+(images["SelectedImageBackground"].currentSrc||images["SelectedImageBackground"].src)+")";;
		me.characterNum = buttonElement.characterId;
		pickerElements["PickerPlayButton"].element.style.opacity = 1;
		pickerElements["PickerPlay"].element.style.opacity = 1;
	}
	
	//---------------------------
	// show
	//---------------------------

	this.doResizeUpdate = function(){
		//scale everything
		var altScale = 1;
		var bottomShift = 0;
		var temp;
		if (hScroll>1)hScroll=0;
		
		if (oSTAGE.wrapper_ratio<0.5625){
			hScrollScaled = -((oSTAGE.scale_inv*window.innerHeight-((window.innerWidth*oSTAGE.scale_inv)*(540.0/960))));
			altScale = oSTAGE.scale_inv*window.innerWidth/960.0;
		} else {
			if (oSTAGE.wrapper_ratio<1) hScroll=0.4;
			bottomShift = -((oSTAGE.scale_inv*window.innerWidth-((window.innerHeight*oSTAGE.scale_inv)*(960/540.0)))/2)/4;
			hScrollScaled = -((oSTAGE.scale_inv*window.innerHeight-((window.innerWidth*oSTAGE.scale_inv)*(540.0/960))))*(hScroll-0.25);
		}
		var keys = Object.keys(pickerElements);
		keys.forEach(function(key){
			var tObj =pickerElements[key];
			if (tObj.type=="group"){
				if (key==="PickerBackground") {
					if (altScale===1){
						temp = (window.innerHeight*oSTAGE.scale_inv)*(960/540.0);
						tObj.element.style.height = (window.innerHeight*oSTAGE.scale_inv)+"px";
						tObj.element.style.width = (temp)+"px";
						tObj.element.style.left = ((oSTAGE.scale_inv*window.innerWidth-temp)/2)+"px";
						tObj.element.style.top = "0px";
					} else {
						temp = (window.innerWidth*oSTAGE.scale_inv)*(540.0/960);
						tObj.element.style.width = (window.innerWidth*oSTAGE.scale_inv)+"px";
						tObj.element.style.height = (temp)+"px";
						tObj.element.style.top = ((oSTAGE.scale_inv*window.innerHeight-temp))+"px";
						tObj.element.style.left = "0px";
					}
				} else {
					if (tObj.align==="center"){
						tObj.element.style.bottom = bottomShift+"px";
						tObj.element.style.left = hScrollScaled+"px";
					}
				}
			}
		});
	}

	this.doUpdateScroll = function() {
		if (curTouch.x>-1000) {
			hScroll-= (curTouch.x)*.1;
			hScroll = Math.max(0.1,Math.min(1,hScroll));
			me.doResizeUpdate();
		}
	}
	this.pickerUpdate = setInterval(me.doUpdateScroll,25);
	
	//---------------------------
	// show
	//---------------------------

	this.doReveal = function(){

	}

	
	//---------------------------
	// destroy
	//---------------------------

	this.doDestroy = function(){
		clearInterval(me.pickerUpdate);
		__utils.doDestroyAllChildren(container);
		resize_updater.forget = true;
	}


	me.doResizeUpdate();
	me.doReveal();

	//register the resizer
	var resize_updater = {doResizeUpdate : me.doResizeUpdate};
	update_queue.push(resize_updater);
		
}



function doFinishSecondLoading(characterId, callback){

  __utils.doLoad3dAssets(assets_threejs_game, oMODELS);
  var characterAssets;
	  switch (characterId){
		  case 1: characterAssets = assets_threejs_1;
			  break;
		  case 2: characterAssets = assets_threejs_2;
			  break;
		  case 3: characterAssets = assets_threejs_3;
			  break;
		  case 4: characterAssets = assets_threejs_4; 
			  break;
			  
	}
  __utils.doLoad3dAssets(characterAssets, oMODELS);

  LOADER = new Loader(true);
  LOADER.doUpdate = function(){
    var prog = (characterAssets.progress + assets_threejs_game.progress) * 0.5;
	  this.doUpdateBar(prog);//Missing?
    if(characterAssets.loaded && assets_threejs_game.loaded){
      this.purge = true;
      if(callback){
        callback();
      }
      LOADER.doFadeAndDestroy();
    }
  }
  actives.push(LOADER);
}
