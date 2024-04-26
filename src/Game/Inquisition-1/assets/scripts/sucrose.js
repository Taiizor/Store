function SucrosePropertyListener(name, val) {
	switch (name) {
		case "dateVisible":
			root.dateVisible = val.value;
			if (root.dateVisible)
				setDate();
			dateContainer.style.visibility = val.value ? "visible" : "hidden";
			break;
		case "dateX":
			dateContainer.style.left = val.value + "%";
			break;
		case "dateY":
			dateContainer.style.top = val.value + "%";
			break;
		case "dateScale":
			dateContainer.style.scale = val.value / 1000;
			break;
		case "dateColor1":
			dateContainer.style.color = "#" + val.value.substring(3);
			break;
		case "dateColor2":
			date.style.backgroundImage = "-webkit-linear-gradient(90deg, #" + val.value.substring(3) + "01 10%, #" + val.value.substring(3) + "DC 50%)";
			break;
		case "weatherVisible":
			root.weatherVisible = val.value;
			weatherContainer.style.visibility = hideWeather() ? "hidden" : "visible";
			break;
		case "weatherCityInput":
			cityName = val.value;
			break;
		case "weatherApiInput":
			weatherApi = val.value;
			break;
		case "weatherBtnRefresh":
			// update weather
			drawWeather();
			break;
		case "miscHour12":
			// set hour format
			root.hour12 = val.value;
			setDate();
			drawWeatherSun(root.weatherData);
			break;
		case "miscPlayVideo":
			if (val.value) {
				document.getElementById("video").play();
			} else {
				document.getElementById("video").pause();
			}
			break;
		case "miscLanguage":
			root.locale = languages[val.value];
			setDate();
			drawWeather();
			break;
	}
}