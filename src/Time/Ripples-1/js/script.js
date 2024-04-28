//settings
let noClock = false;
let _12hour = false;
var mmddyy = true;
let cityName = ""; // your city name
let units = "metric"; //metric or imperial
let weatherApi = ""; //your open weather api key here. uses current weather and 5 day 3 hour forecast

let clockEl = document.querySelector("#clock");
let timeEl = document.querySelector(".time");
let dateEl = document.querySelector(".date");
clockEl.style.marginTop = `${timeEl.offsetHeight}px`;
var maxTemp = 0,
	minTemp = 999;

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

setInterval(time, 1000);
time();

function time() {
	if (noClock && clockEl.style.display != "none") {
		clockEl.style.display = "none";
		document.getElementById('WeatherWhole').style.marginTop = 0;
		window.dispatchEvent(new Event('resize'));
	} else if (!noClock && clockEl.style.display != "block") {
		clockEl.style.display = "block";
		document.getElementById('WeatherWhole').style.marginTop = "10%";
		window.dispatchEvent(new Event('resize'));
	}

	let d = new Date();

	timeEl.innerHTML = getFormatedTime();

	if (mmddyy)
		dateEl.innerText = new Intl.DateTimeFormat('en-US', {
			'month': 'short',
			'day': '2-digit',
			'year': '2-digit'
		}).format(d).replace(',', '').replace(/ /g, '/');
	else
		dateEl.innerText = new Intl.DateTimeFormat('en-GB', {
			'day': '2-digit',
			'month': '2-digit',
			'year': '2-digit'
		}).format(d).replace(',', '').replace(/ /g, '/');

}

function getWeather() {
	if (cityName === "" || units === "" || weatherApi === "" || cityName == "city, country") {
		document.getElementById('WeatherWhole').style.display = "none";
		document.getElementById('error').style.display = "block";
		return;
	}
	if (document.getElementById('WeatherWhole').style.display == "none") {
		document.getElementById('WeatherWhole').style.display = "block";
		document.getElementById('error').style.display = "none";
	}

	var weatherEnd = cityName + "&units=" + units + "&APPID=" + weatherApi;
	var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + weatherEnd;
	var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + weatherEnd;

	//fetch current weather data json
	fetch(weatherURL)
		.then(response => {
			if (response.status != 200) {
				document.getElementById('WeatherWhole').style.display = "none";
				document.getElementById('error').style.display = "block";
			} else {
				response.json().then(data => showCurrentWeather(data));
			}
		})

	//fetch forecast data json
	fetch(forecastURL)
		.then(response => {
			if (response.status != 200) {
				document.getElementById('WeatherWhole').style.display = "none";
				document.getElementById('error').style.display = "block";
			} else {
				response.json().then(data => showForecastWeather(data));
			}
		})
}

function showCurrentWeather(data) {

	var tempTime = new Date;
	//reset max and min temp at midnight
	if (tempTime.getHours() == 0)
		maxTemp = 0, minTemp = 999;

	//current temperature and weather icon
	document.getElementById('currentTemp').innerHTML = leadingZero(Math.round(data.main.temp)) + "&deg;";
	//openweathermap icon url: http://openweathermap.org/img/wn/10d@2x.png
	document.getElementById('currentImg').src = "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png";

	//Sunrise and sunset times
	let time = new Date(data.sys.sunrise * 1000);
	document.getElementById('sunriseTime').innerHTML = leadingZero(time.getHours()) + ':' + leadingZero(time.getMinutes());
	time = new Date(data.sys.sunset * 1000);
	document.getElementById('sunsetTime').innerHTML = leadingZero(_12hour ? time.getHours() - 12 : time.getHours()) + ':' + leadingZero(time.getMinutes());

	//Todays Max and Min Temps
	let t = Math.round(data.main.temp_max);
	if (t > maxTemp)
		maxTemp = t;
	t = Math.round(data.main.temp_min);
	if (t < minTemp)
		minTemp = t;

	document.getElementById('minTemp').innerHTML = leadingZero(minTemp) + '&deg;';
	document.getElementById('maxTemp').innerHTML = leadingZero(maxTemp) + '&deg;';

}

function showForecastWeather(data) {

	//Display Date. Used to determine how many forecast item menus to show
	dd = [false, false, false, false, false, false];

	//I did what i had to do to get it to work.
	//dont judge me
	var today = new Date();
	let values = {
		"icon": {},
		"temp": {}
	}

	let day = 12;
	for (var x of data.list) {
		let date = new Date(x.dt_txt.toString());
		if (day != date.getDay()) {
			day = date.getDay();
		}
		try {
			values["temp"][date.getDay()].push(x.main.temp);
			values["icon"][date.getDay()].push(x.weather[0].icon);
		} catch {
			values["temp"][date.getDay()] = [x.main.temp]
			values["icon"][date.getDay()] = [x.weather[0].icon]
		}
	}

	let daysIndex = [(today.getDay() + 1) % 7, (today.getDay() + 2) % 7, (today.getDay() + 3) % 7, (today.getDay() + 4) % 7, (today.getDay() + 5) % 7]
	for (var i in daysIndex) {
		var maxT = 0;
		var minT = 999;
		if (values["temp"][daysIndex[i]] != undefined) {
			for (var y of values["temp"][daysIndex[i]]) {
				if (y > maxT) {
					maxT = y;
				}
				if (y < minT) {
					minT = y;
				}
			}


			dd[Math.floor(i) + 1] = true;

			document.getElementById(`forecastday${Math.floor(i)+1}`).innerHTML = days[daysIndex[i]];
			document.getElementById(`forecasttemp${Math.floor(i)+1}`).innerHTML = leadingZero(Math.round(minT)) + '&deg;/' + leadingZero(Math.round(maxT)) + '&deg;';

			var icons = values["icon"][daysIndex[i]];
			//openweathermap icon url: http://openweathermap.org/img/wn/10d@2x.png
			document.getElementById(`forecastimg${Math.floor(i)+1}`).src = "http://openweathermap.org/img/wn/" + icons[Math.floor(icons.length / 2)] + "@2x.png";
		}

	}
	//hide forecast elements if no data
	for (var z = 1; z < dd.length; z++) {
		if (dd[z] != true)
			document.getElementById('forecast' + z).style.display = "none";
		else {
			document.getElementById('forecast' + z).style.display = "";
		}
	}

	document.getElementById('updatedTime').innerHTML = getFormatedTime();
}

function leadingZero(val) {
	if (val < 10 && val >= 0) {
		return '0' + val;
	} else if (val > -10 && val <= 0) {
		return '-0' + Math.abs(val);
	} else {
		return val;
	}
}

function getFormatedTime() {
	let d = new Date();
	if (_12hour)
		return new Intl.DateTimeFormat('en-US', {
			'hour': '2-digit',
			'minute': '2-digit',
			'second': '2-digit',
			'hour12': true
		}).format(d);

	return new Intl.DateTimeFormat('en-US', {
		'hour': '2-digit',
		'minute': '2-digit',
		'second': '2-digit',
		'hour12': false
	}).format(d);
}

//updates the weather each hour
setInterval(getWeather, 1 * 60 * 60 * 1000);
//getWeather();

//Handles weirdness with the image not resizing
let antiFlick;
new ResizeObserver(() => {
	if (antiFlick)
		clearTimeout(antiFlick);

	antiFlick = setTimeout(() => window.dispatchEvent(new Event('resize'), 500));

}).observe($('#WeatherWhole')[0]);