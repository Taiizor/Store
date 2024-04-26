const weatherContainer = document.getElementById("weatherContainer");
const temp = document.getElementById("currentTemp");

var cityName = ""; // your city name
var units = "metric"; //metric or imperial
var weatherApi = ""; //your open weather api key here. uses current weather and 5 day 3 hour forecast

var maxTemp=0,minTemp=999;


function drawWeather() {
  weatherContainer.style.visibility = hideWeather() ? "hidden" : "visible";
  if (!hideWeather())
    getWeather();
}

function hideWeather(){
  return !root.weatherVisible || cityName ==="" || cityName === "city, country" || units ==="" || weatherApi ==="" || weatherApi ==="openweathermap.org key"
}

function getWeather() {
  // var weatherEnd=cityName+"&units="+units+"&APPID="+weatherApi;
  var weatherEnd=cityName+"&units="+root.locale.units+"&APPID="+weatherApi+"&lang="+root.locale.locale.substring(0,2);
  var weatherURL="https://api.openweathermap.org/data/2.5/weather?q="+weatherEnd;
  // var forecastURL="https://api.openweathermap.org/data/2.5/forecast?q="+weatherEnd;

  //fetch current weather data json
  fetch(weatherURL)
      .then(response=>{
          if(response.status!=200){
            weatherContainer.style.visibility = "hidden";
          }
          else{
            response.json().then(data=>showWeather(data));
          }
      })
}

function showWeather(data){
  root.weatherData = data;
  const dt = new Date;
  //reset max and min temp at midnight
	if(dt.getHours()==0)
    maxTemp=0,minTemp=999;


  document.getElementById("weatherIcon").className = "wi "+weatherIcons[data.weather[0].icon];

  document.getElementById("weatherCurrentTemp").innerHTML= leadingZero(Math.round(data.main.temp)) + "&deg;";
  document.getElementById("weatherDescription").innerHTML= data.weather[0].description;
  document.getElementById("weatherFeels").innerHTML= leadingZero(Math.round(data.main.feels_like));
  document.getElementById("weatherHumidity").innerHTML= data.main.humidity;
  document.getElementById("weatherPressure").innerHTML= data.main.pressure;

  //Sunrise and sunset times
  drawWeatherSun(data)

  //Todays Max and Min Temps
	var t = Math.round(data.main.temp_max);
	if(t>maxTemp)
		maxTemp=t;
	t = Math.round(data.main.temp_min);
	if(t<minTemp)
		minTemp=t;

	document.getElementById('weatherMinTemp').innerHTML=leadingZero(minTemp);
	document.getElementById('weatherMaxTemp').innerHTML = leadingZero(maxTemp);

}

function drawWeatherSun(data){
	var time = new Date(data.sys.sunrise*1000);
	document.getElementById('sunriseTime').innerHTML=time.toLocaleTimeString(root.locale.locale,{hour12: root.hour12, hour: "2-digit", minute:"2-digit" });
	time = new Date(data.sys.sunset*1000);
	document.getElementById('sunsetTime').innerHTML=time.toLocaleTimeString(root.locale.locale,{hour12: root.hour12, hour: "2-digit", minute:"2-digit" });
}

function leadingZero(val){
	if(val<10 && val>=0)
	{
		return '0'+val;
	}
  else if(val>-10 && val<=0){
    return '-0'+Math.abs(val);
  }
	else{
		return val;
	}
}

setInterval(drawWeather, 1*60*60*1000);