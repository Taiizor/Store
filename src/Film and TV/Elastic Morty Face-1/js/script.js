let qualityPreference = 0;
let qualityVisible = false;

function SucrosePropertyListener(name, val) {
	switch (name) {
		case "qualityMode":
			qualityPreference = val.value;
			qualityMode(qualityPreference);
			break;
		case "qualityChange":
			qualityVisible = val.value;
			qualityChange(qualityVisible);
			break;
		default:
			break;
	}
}

function qualityMode(index) {
	if (index == 0) {
		document.getElementById('quality-high').click();
	} else {
		document.getElementById('quality-medium').click();
	}
}

function qualityChange(visible) {
	if (visible) {
		document.getElementById('quality-container').style.display = 'block';
	} else {
		document.getElementById('quality-container').style.display = 'none';
	}
}

setInterval(function() {
	qualityChange(qualityVisible);
	qualityMode(qualityPreference);
}, 500);