//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//----- game screen -----
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////


function GameScreen() {

	var me = this;

	var msg_timeout;
	var show_logo = true;
	var legal_div;

	//---------------------------
	// init
	//---------------------------

	var container = document.getElementById("div_screens");
	var legal_div = document.getElementById("div_legal");
	__utils.doDestroyAllChildren(container);
	container.style.backgroundColor = "";

	var hud_messages = container.appendChild(document.createElement("div"));
	hud_messages.className = "hud_messages";
	hud_messages.style.display = "none";

	
	
	if (show_logo) {
		var film_logo_block = container.appendChild(document.createElement("div"));
		film_logo_block.className = "film_logo_block";

		var logo = film_logo_block.appendChild(document.createElement("img"));
		logo.className = "film_logo_img";
		logo.style.height = "100px";
		logo.src = oLANG_IMAGES.logo;
		logo.onload = function () {
			me.doResizeUpdate();
		}

		var logo_date = film_logo_block.appendChild(document.createElement("div"));
		logo_date.className = "film_logo_date";
		__utils.doHTMLText(logo_date, date_msg);
	}

	this.doUpdateScore = function (value) {
		hud_score_amt.innerHTML = value;
	}

	this.doShowMessage = function (lang_obj, timeout) {

		__utils.doHTMLText(hud_messages, lang_obj);
		hud_messages.style.opacity = 1;
		hud_messages.style.display = "block";

		hud_messages.style.left = ((container.clientWidth - hud_messages.clientWidth) * 0.5) + "px";
		hud_messages.style.top = ((container.clientHeight - hud_messages.clientHeight) * 0.5) + "px";

		clearTimeout(msg_timeout);

		if (timeout) {
			msg_timeout = setTimeout(me.doHideMessage, timeout * 1000);
		}
	}

	this.doHideMessage = function () {
		TweenLite.to(hud_messages, 0.5, {
			opacity: 0,
			overwrite: true,
			onComplete: function () {
				hud_messages.style.display = "none";
			}
		});
	}

	//---------------------------
	// resize update
	//---------------------------

	this.doResizeUpdate = function () {

		hud_messages.style.left = ((container.clientWidth - hud_messages.clientWidth) * 0.5) + "px";
		hud_messages.style.top = ((container.clientHeight - hud_messages.clientHeight) * 0.5) + "px";

		//hud_score_amt.style.left = ((container.clientWidth - hud_score_amt.clientWidth) * 0.5) + "px";
		if(show_logo){
			film_logo_block.style.left = ((container.clientWidth - film_logo_block.clientWidth)-10 ) + "px";
			//film_logo_block.style.bottom = ( film_logo_block.clientHeight + 20) + "px";
			film_logo_block.style.top = (window.innerHeight*oSTAGE.scale_inv - film_logo_block.clientHeight + 25 - legal_div.clientHeight) + "px";
		}

	}


	//---------------------------
	// transition
	//---------------------------

	this.doReveal = function () {

		var delay = 1.0;

	}


	this.doHide = function () {

	}


	//---------------------------
	// destroy
	//---------------------------

	this.doDestroy = function () {
		__utils.doDestroyAllChildren(container);
		resize_updater.forget = true;
	}


	me.doResizeUpdate();
	me.doReveal();

	//register the resizer
	var resize_updater = {
		doResizeUpdate: me.doResizeUpdate
	};
	update_queue.push(resize_updater);
}