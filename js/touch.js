
enableGameTouches();

function enableGameTouches() {
	document.addEventListener('touchstart', F_event_Touch_onDocument_handle, false);
	document.addEventListener('touchend', F_event_Touch_onDocument_handle, false);
	window.addEventListener('touchmove', F_event_Touch_onDocument_handle, false);
	document.addEventListener('mousedown', F_event_Touch_onDocument_handle, false);
	document.addEventListener('mouseup', F_event_Touch_onDocument_handle, false);
	window.addEventListener('mousemove', F_event_Touch_onDocument_handle, false);
}

function disableGameTouches() {
	document.removeEventListener('touchstart', F_event_Touch_onDocument_handle, false);
	document.removeEventListener('touchend', F_event_Touch_onDocument_handle, false);
	window.removeEventListener('touchmove', F_event_Touch_onDocument_handle, false);
	document.removeEventListener('mousedown', F_event_Touch_onDocument_handle, false);
	document.removeEventListener('mouseup', F_event_Touch_onDocument_handle, false);
	window.removeEventListener('mousemove', F_event_Touch_onDocument_handle, false);
}
//===========================================================================================

var thisTouch = {
	x: -1000,
	y: -1000
};
var curTouch = {
	x: -1000,
	y: -1000
}
var halfPie = Math.PI * 1.25; //USed for finding angle of a swipe
var lastActionTime = -1;

var __lastSwipe = -1;

function F_event_Touch_onDocument_handle(evt) {
	"use strict";
	if (evt.type.indexOf("touch")>-1){
		if (evt.touches.length > 1) {
			return; // ignore multi finger touches
		}
	}
	//------------------------------------------------------------------------------------
	
	var reaction_type = null;
	var touch = null;
	//... see here for event types  http://www.w3schools.com/jsref/dom_obj_event.asp  

	switch (evt.type) {
		case "touchstart":
			touch = evt.changedTouches[0]; //... specify which touch for later extraction of XY position values.
			reaction_type = "onclick";
			break;
		case "touchmove": // I don't use this
			//evt.preventDefault();
			touch = evt.changedTouches[0];
			reaction_type = "mousemove";
			break;
		case "touchend": // I don't use this   
			touch = evt.changedTouches[0];
			reaction_type = "mouseup";
			break;
		case "mousedown":
			reaction_type = "onclick";
			touch = evt;
			break;
		case "mousemove":
			//evt.preventDefault();
			reaction_type = "mousemove";
			touch = evt;
			break;
		case "mouseup":
			touch = evt;
			reaction_type = "mouseup";
			break;
	}

	if (reaction_type === "mouseup") {
		if (thisTouch.x > -1) {
			thisTouch.x = -1000;
			curTouch.x = -1000;
			__lastSwipe=-1;
		}
	}

	if (reaction_type === "onclick") {
		thisTouch.x = (touch.clientX / window.innerWidth) * 2 - 1;
		thisTouch.y = -(touch.clientY / window.innerHeight) * 2 + 1;
		
	} 
	if (reaction_type==="mousemove") {
		
		if (thisTouch.x > -1) {
			curTouch = {};
			curTouch.x = ((touch.clientX / window.innerWidth) * 2 - 1) - thisTouch.x;
			curTouch.y = (-(touch.clientY / window.innerHeight) * 2 + 1) - thisTouch.y;
			if (Math.abs(curTouch.x)+Math.abs(curTouch.y)>.05) {
				var angle = Math.floor(2 * (halfPie - Math.atan2(curTouch.y, curTouch.x)) / Math.PI);
				if (angle < 1) {angle = 4;}
				__lastSwipe = angle;
			}
		}
		evt.preventDefault();
	}
	//if (gameState===2 && reaction_type==="onclick") evt.preventDefault();	
	
	return false;
}