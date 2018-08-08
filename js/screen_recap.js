

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//----- recap screen -----
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////


function RecapScreen (unlock){

	var me = this;
	me.id = "screen";

	//---------------------------
	// init
	//---------------------------

	if(__snds.getNowPlaying("music") != "music_title_loop"){
	  __snds.playSound("music_title_loop", "music", -1, .25);
	}

	var container = document.getElementById("div_screens");
	__utils.doDestroyAllChildren(container);


	//character
	var character = container.appendChild(document.createElement("div"));
	character.className = "character_recap";

	//film logo
	var film_logo_block = container.appendChild(document.createElement("div"));
	film_logo_block.className = "film_logo_block";

	var logo = film_logo_block.appendChild(document.createElement("img"));
	logo.className = "film_logo_img";
	logo.src = oLANG_IMAGES.logo;

	var logo_date = film_logo_block.appendChild(document.createElement("div"));
	logo_date.className = "film_logo_date";
	__utils.doHTMLText(logo_date, date_msg);

	//game logo
	var recap_table = container.appendChild(document.createElement("table"));
	recap_table.className = "recap_table";
	recap_table.style.margin = "0px";
	recap_table.setAttribute("border", "0");

	var meterSymbol = " <span style='font-size:50%'>"+ oLANG.MeterShort.value+"</span>";
	var tr = recap_table.appendChild(document.createElement("tr"));

	var left_column = tr.appendChild(document.createElement("td"));
	left_column.className = "recap_tablecell";
	left_column.style.textAlign = "right";
	left_column.style.fontSize = "65px";
	left_column.setAttribute("valign", "middle");
	__utils.doHTMLText(left_column, oLANG.score);
	
	var right_column = tr.appendChild(document.createElement("td"));
	right_column.className = "recap_tablecell";
	right_column.style.textAlign = "left";
	right_column.style.fontSize = "115px";
	right_column.style.color = "white";
	right_column.setAttribute("valign", "middle");
	__utils.doHTMLText(right_column, GAME.score+meterSymbol);


	var tr = recap_table.appendChild(document.createElement("tr"));

	var left_column = tr.appendChild(document.createElement("td"));
	left_column.className = "recap_tablecell";
	left_column.style.textAlign = "right";
	left_column.style.fontSize = "50px";
	left_column.setAttribute("valign", "middle");
	__utils.doHTMLText(left_column, oLANG.best_score);
	
	var right_column = tr.appendChild(document.createElement("td"));
	right_column.className = "recap_tablecell";
	right_column.style.textAlign = "left";
	right_column.style.fontSize = "75px";
	right_column.style.color = "white";
	right_column.setAttribute("valign", "middle");
	__utils.doHTMLText(right_column, oUSER.best_score +meterSymbol);


	var tr = recap_table.appendChild(document.createElement("tr"));
	var left_column = tr.appendChild(document.createElement("td"));
	var left_column = tr.appendChild(document.createElement("td"));

	//play button
	var b_play= container.appendChild(document.createElement("div"));
	b_play.className = "b_play";
	__utils.doHTMLText(b_play, oLANG.play_again);
	b_play.onmouseup = function(e){
		sCode.trackGame("cruiseshiprun","playagain");
		__snds.playSound("snd_click", "interface");
		me.doDestroy();
		doFinishLoading(function(){
			SCREEN = new PickerScreen();
			//GAME = new Game();
		});
	}

	b_play.onmouseover = function(e){
		TweenLite.to(e.target, .1, {transform: "scale(1.1, 1.1)", overwrite:true});
	}
	b_play.onmouseout = function(e){
		TweenLite.to(e.target, .5, {transform: "scale(1.0, 1.0)", overwrite:true, ease: Elastic.easeOut.config(1, 0.5)});
	}

	//main site button
	var b_main= container.appendChild(document.createElement("div"));
	b_main.className = "b_main";
	__utils.doHTMLText(b_main, oLANG.main_site);
	b_main.onmouseup = function(e){
		window.open(main_site_url, "_blank");
	}

	//---------------------------
	// unlock message handling
	//---------------------------
	
	var recap_unlock_block = container.appendChild(document.createElement("div"));
	if (unlock>0) {
		var recap_unlock = recap_unlock_block.appendChild(document.createElement("div"));
		recap_unlock.className = "recap_unlock";
		
		var recap_unlock_text = recap_unlock_block.appendChild(document.createElement("div"));
		switch (unlock){
			case 1:
				recap_unlock_text.className = "recap_unlock_text";
				__utils.doHTMLText(recap_unlock_text, oLANG.RecapUnlockFrank);
				var recap_unlock_frank = recap_unlock_block.appendChild(document.createElement("div"));
				recap_unlock_frank.className = "recap_unlock_frank";
				break;
			case 2:
				recap_unlock_text.className = "recap_unlock_text";
				__utils.doHTMLText(recap_unlock_text, oLANG.RecapUnlockMurray);
				var recap_unlock_murray = recap_unlock_block.appendChild(document.createElement("div"));
				recap_unlock_murray.className = "recap_unlock_murray";
				break;
			case 3:
				recap_unlock_text.className = "recap_unlock_text_both";
				__utils.doHTMLText(recap_unlock_text, oLANG.RecapUnlockBoth);
				var recap_unlock_frank = recap_unlock_block.appendChild(document.createElement("div"));
				recap_unlock_frank.className = "recap_unlock_frank";
				var recap_unlock_murray = recap_unlock_block.appendChild(document.createElement("div"));
				recap_unlock_murray.className = "recap_unlock_murray";
				recap_unlock_murray.style.left = "120px";
						
				break;
		}
	}

	//---------------------------
	// resize update
	//---------------------------
	this.doResizeUpdate = function(){

		var column_x;
		if(oSTAGE.is_landscape){
			column_x = Math.max(b_main.clientWidth + 70 + (film_logo_block.clientWidth * 0.5), oSTAGE.wrapper_width * 0.43);
		}else{
			column_x = oSTAGE.wrapper_width * 0.5;
		}

		film_logo_block.style.left = (column_x - (film_logo_block.clientWidth * 0.5)) + "px";
		
		b_play.style.left = (column_x - (b_play.clientWidth * 0.5)) + "px";

		var y1 = film_logo_block.offsetTop + film_logo_block.clientHeight;
		var y2 = b_play.offsetTop;
		var s = (y2-y1) * 0.5;

		recap_table.style.left = (column_x - (recap_table.clientWidth * 0.5)) + "px";

		if(oSTAGE.is_landscape){
			b_play.style.bottom = "78px";
		}else{
			b_play.style.bottom = "80px";
		}
	
	}


	


	//---------------------------
	// transition
	//---------------------------

	this.doReveal = function(){

		character.style.transform = "translateX(" + (oSTAGE.wrapper_width - character.offsetLeft) + "px)";
		b_play.style.transform = "translateY(" + (oSTAGE.wrapper_height - b_play.offsetTop) + "px)";
		recap_unlock_block.style.transform = "translateX(" + ( - recap_unlock_block.clientWidth) + "px)";

		var delay = 1.0;
		TweenLite.to(character, 1.0, {transform:"translateX(0px)", overwrite:true, ease: Elastic.easeOut.config(1.0, .8), delay: delay});
		delay += 1.0;
		TweenLite.to(b_play, 0.75, {transform:"translateY(0px)", overwrite:true, ease: Elastic.easeOut.config(1.0, .8), delay: delay});
		
		delay += 1.0;
		TweenLite.to(recap_unlock_block, 0.75, {transform:"translateX(0px)", overwrite:true, ease: Elastic.easeOut.config(1.0, .8), delay: delay});
		

	}

	//---------------------------
	// destroy
	//---------------------------

	this.doDestroy = function(){
		__utils.doDestroyAllChildren(container);
		resize_updater.forget = true;
	}


	me.doResizeUpdate();
	me.doReveal();

	//register the resizer
	var resize_updater = {doResizeUpdate : me.doResizeUpdate};
	update_queue.push(resize_updater);
}