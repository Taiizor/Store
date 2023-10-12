var myhour, myminute, mysecond;

function flipNumber(el, newnumber) {
	var thistop = el.find(".top").clone();
	var thisbottom = el.find(".bottom").clone();
	thistop.addClass("new");
	thisbottom.addClass("new");
	thisbottom.find(".text").text(newnumber);
	el.find(".top").after(thistop);
	el.find(".top.new").append(thisbottom);
	el.addClass("flipping");
	el.find(".top:not(.new)").find(".text").text(newnumber);
	setTimeout(function() {
		el.find(".bottom:not(.new)").find(".text").text(newnumber);
	}, 500);
}

function setTime() {
	$(".flipper").removeClass("flipping");
	$(".flipper .new").remove();
	var date = new Date();
	var seconds = date.getSeconds().toString();
	if (seconds.length == 1) {
		seconds = "0" + seconds;
	}
	var minutes = date.getMinutes().toString();
	if (minutes.length == 1) {
		minutes = "0" + minutes;
	}
	var hour = date.getHours();
	/*if (hour > 12) {
	  hour = hour - 12;
	}
	if (hour == 0) {
	  hour = 12;
	}*/
	hour = hour.toString();
	if (hour.length == 1) {
		hour = "0" + hour;
	}
	if ($(myhour[0]).text() !== hour) {
		flipNumber($(myhour[0]).closest(".flipper"), hour);
	}
	if ($(myminute[0]).text() !== minutes) {
		flipNumber($(myminute[0]).closest(".flipper"), minutes);
	}
	if ($(mysecond[0]).text() !== seconds) {
		flipNumber($(mysecond[0]).closest(".flipper"), seconds);
	}
	setTimeout(function() {
		setTime();
	}, 500);
}

$(function() {
	myhour = $(".clock .flipper:nth-child(1) div:not(.new) .text");
	myminute = $(".clock .flipper:nth-child(2) div:not(.new) .text");
	mysecond = $(".clock .flipper:nth-child(3) div:not(.new) .text");
	setTime();
});