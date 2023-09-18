var image = document.getElementById("image");

var Wallpaper = {
	0: "img/0.png",
	1: "img/1.png",
	2: "img/2.png",
	3: "img/3.png",
	4: "img/4.png",
	5: "img/5.png",
	6: "img/6.png",
	7: "img/7.png",
	8: "img/8.png",
	9: "img/9.png",
	10: "img/10.png",
	11: "img/11.png",
	12: "img/12.png",
	13: "img/13.png",
	14: "img/14.png",
	15: "img/15.png",
	16: "img/16.png",
	17: "img/17.png",
	18: "img/18.png",
	19: "img/19.png",
	20: "img/20.png",
	21: "img/21.png",
	22: "img/22.png",
	23: "img/23.png"
};

function SucroseStretchMode(Type) {
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

function SucroseSystemDate(Date) {
	var src = image.src;
	var wall = Wallpaper[Date.Hour];

	if (src !== wall) {
		image.src = wall;
	}
}