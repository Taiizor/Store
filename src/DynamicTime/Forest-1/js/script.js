var image = document.getElementById("image");

var Wallpaper = {
	0: "img/0.jpg",
	1: "img/0.jpg",
	2: "img/0.jpg",
	3: "img/0.jpg",
	4: "img/0.jpg",
	5: "img/1.jpg",
	6: "img/1.jpg",
	7: "img/1.jpg",
	8: "img/1.jpg",
	9: "img/1.jpg",
	10: "img/1.jpg",
	11: "img/1.jpg",
	12: "img/1.jpg",
	13: "img/1.jpg",
	14: "img/1.jpg",
	15: "img/1.jpg",
	16: "img/1.jpg",
	17: "img/1.jpg",
	18: "img/2.jpg",
	19: "img/2.jpg",
	20: "img/0.jpg",
	21: "img/0.jpg",
	22: "img/0.jpg",
	23: "img/0.jpg"
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

function SucroseComputerDate(data) {
	var src = image.src;
	var wall = Wallpaper[data.Hour];

	if (src !== wall) {
		image.src = wall;
	}
}