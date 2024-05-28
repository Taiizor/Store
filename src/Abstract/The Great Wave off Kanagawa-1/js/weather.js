let cityName = ""; // your city name
let units = "metric"; //metric or imperial
let weatherApi = "apikey"; //your open weather api key here. uses current weather and 5 day 3 hour forecast

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var mmddyy = true;

setInterval(time, 1000);
time();

function time() {
	let time = new Date();
	if (mmddyy)
		document.getElementById('date').innerText = new Intl.DateTimeFormat('en-US', {
			'month': 'short',
			'day': '2-digit',
			'year': '2-digit'
		}).format(time).replace(',', '').replace(/ /g, '/');
	else
		document.getElementById('date').innerText = new Intl.DateTimeFormat('en-GB', {
			'day': '2-digit',
			'month': '2-digit',
			'year': '2-digit'
		}).format(time).replace(',', '').replace(/ /g, '/');

	var Hour = time.getHours() % 12 ? time.getHours() % 12 : 12;
	Hour = Hour == 0 ? 12 : Hour;
	Hour = Hour < 10 ? "0" + Hour : Hour;
	var Minute = time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
	var Second = time.getSeconds() < 10 ? "0" + time.getSeconds() : time.getSeconds();
	var Meridiem = time.getHours() < 12 ? "AM" : "PM";
	//Meridiem = Meridiem.fontsize(2);
	var clock = document.getElementById("time");
	var timeText = Hour + ":" + Minute + ":" + Second;
	clock.innerText = timeText;
}


function getWeather() {
	if (cityName === "" || units === "" || weatherApi === "") {
		document.getElementById('summary').innerHTML = 'Enter city/api';
		return;
	}

	var weatherEnd = cityName + "&units=" + units + "&APPID=" + weatherApi;
	var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + weatherEnd;
	var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + weatherEnd;

	//fetch current weather data json
	fetch(weatherURL)
		.then(response => {
			if (response.status != 200) {
				document.getElementById('summary').innerHTML = 'Error ' + response.status;
			} else {
				response.json().then(data => showCurrentWeather(data));
			}
		})

}

function showCurrentWeather(data) {
	document.getElementById('currentTemp').innerHTML = leadingZero(Math.round(data.main.temp)) + "&deg;";
	document.getElementById('summary').innerHTML = data.weather[0].description;
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

//Sucrose
function SucrosePropertyListener(name, val) {
	switch (name) {
		case "uiCheck":
			if (val.value) {
				document.getElementById('card').style.visibility = "visible";
			} else {
				document.getElementById('card').style.visibility = "hidden";
			}
			break;
		case "cityInput":
			cityName = val.value;
			break;
		case "apiInput":
			weatherApi = val.value;
			break;
		case "unit":
			if (val.value == 0)
				units = "metric";
			else
				units = "imperial";
			//last item on property, check weather now.
			getWeather();
			break;
		case "btnRefresh":
			//update weather.
			getWeather();
			break;
	}
}