var image = document.getElementById("image");

var Wallpaper = {
	0: "img/forest0.jpg",
	1: "img/forest0.jpg",
	2: "img/forest0.jpg",
	3: "img/forest0.jpg",
	4: "img/forest0.jpg",
	5: "img/forest1.jpg",
	6: "img/forest1.jpg",
	7: "img/forest1.jpg",
	8: "img/forest1.jpg",
	9: "img/forest1.jpg",
	10: "img/forest1.jpg",
	11: "img/forest1.jpg",
	12: "img/forest1.jpg",
	13: "img/forest1.jpg",
	14: "img/forest1.jpg",
	15: "img/forest1.jpg",
	16: "img/forest1.jpg",
	17: "img/forest1.jpg",
	18: "img/forest2.jpg",
	19: "img/forest2.jpg",
	20: "img/forest0.jpg",
	21: "img/forest0.jpg",
	22: "img/forest0.jpg",
	23: "img/forest0.jpg"
};

function SetStretchType(Type) {
	switch (Type) {
		case "None":
			image.style.objectFit = "none";
			break;
		case "Fill":
			image.style.objectFit = "fill";
			break;
		case "Uniform":
			image.style.objectFit = "contain";
			break;
		case "UniformToFill":
			image.style.objectFit = "cover";
			break;
		default:
			break;
	}
}

function GetComputerTime() {
	var date = new Date();
	//var hours = date.getHours().toString().padStart(2, '0');
	//var minutes = date.getMinutes().toString().padStart(2, '0');
	//var seconds = date.getSeconds().toString().padStart(2, '0');
	//return hours + ":" + minutes + ":" + seconds;
	return date.getHours();
}

function CheckWallpaper() {
	var src = image.src;
	var hour = GetComputerTime();
	var wall = Wallpaper[hour];

	if (src !== wall) {
		image.src = wall;
	}
}

setInterval(CheckWallpaper, 1000);

CheckWallpaper();