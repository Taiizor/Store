var Draggable = function(id) {
	var el = document.getElementById(id),
		isDragReady = false,
		dragoffset = {
			x: 0,
			y: 0
		};
	this.init = function() {
		//only for this demo
		this.initPosition();
		this.events();
	};
	//only for this demo
	this.initPosition = function() {
		el.style.position = "absolute";
		el.style.top = "40%";
		el.style.right = "10%";
	};
	//events for the element
	this.events = function() {
		var self = this;
		_on(el, 'mousedown', function(e) {
			isDragReady = true;
			//corssbrowser mouse pointer values
			e.pageX = e.pageX || e.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
			e.pageY = e.pageY || e.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
			dragoffset.x = e.pageX - el.offsetLeft;
			dragoffset.y = e.pageY - el.offsetTop;
		});
		_on(document, 'mouseup', function() {
			isDragReady = false;
		});
		_on(document, 'mousemove', function(e) {
			if (isDragReady) {
				e.pageX = e.pageX || e.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
				e.pageY = e.pageY || e.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
				// left/right constraint
				if (e.pageX - dragoffset.x < 0) {
					offsetX = 0;
				} else if (e.pageX - dragoffset.x + 102 > document.body.clientWidth) {
					offsetX = document.body.clientWidth - 102;
				} else {
					offsetX = e.pageX - dragoffset.x;
				}

				// top/bottom constraint   
				if (e.pageY - dragoffset.y < 0) {
					offsetY = 0;
				} else if (e.pageY - dragoffset.y + 102 > document.body.clientHeight) {
					offsetY = document.body.clientHeight - 102;
				} else {
					offsetY = e.pageY - dragoffset.y;
				}

				el.style.top = offsetY + "px";
				el.style.left = offsetX + "px";
			}
		});
	};
	//cross browser event Helper function
	var _on = function(el, event, fn) {
		document.attachEvent ? el.attachEvent('on' + event, fn) : el.addEventListener(event, fn, !0);
	};
	this.init();
}

new Draggable('drag');