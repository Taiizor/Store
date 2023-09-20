var image = document.getElementById("image");

var Wallpaper = {
	0: "img/0.jpg",
	1: "img/1.jpg",
	2: "img/2.jpg",
	3: "img/3.jpg",
	4: "img/4.jpg",
	5: "img/5.jpg",
	6: "img/6.jpg",
	7: "img/7.jpg",
	8: "img/8.jpg",
	9: "img/9.jpg",
	10: "img/10.jpg",
	11: "img/11.jpg",
	12: "img/12.jpg",
	13: "img/13.jpg",
	14: "img/14.jpg",
	15: "img/15.jpg",
	16: "img/16.jpg",
	17: "img/17.jpg",
	18: "img/18.jpg",
	19: "img/19.jpg",
	20: "img/20.jpg",
	21: "img/21.jpg",
	22: "img/22.jpg",
	23: "img/23.jpg"
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
	if (Date.State) {
		var src = image.src;
		var wall = Wallpaper[Date.Hour];

		if (src !== wall) {
			image.src = wall;
		}
	}
}