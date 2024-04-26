const root = {
  dateVisible: true,
  weatherVisible: true,
  hour12: false,
  locale: {language: "English_WORLD", locale: "en-CA", units: "metric" },
  weatherData: {}
};

const languages = [
  {language: "English_WORLD", locale: "en-CA", units: "metric" },
  {language: "Bahasa_Indonesia", locale: "id-ID", units: "metric" },
  {language: "Bahasa_Melayu", locale: "ms-MY", units: "metric" },
  {language: "Bulgarian", locale: "bg-BG", units: "metric" },
  {language: "Chinese", locale: "zh-CN", units: "metric" },
  {language: "Croatian", locale: "hr-HR", units: "metric" },
  {language: "Czech", locale: "cs-CZ", units: "metric" },
  {language: "Danish", locale: "da-DK", units: "metric" },
  {language: "Dutch", locale: "nl-NL", units: "metric" },
  {language: "English_GB", locale: "en-GB", units: "metric" },
  {language: "English_US", locale: "en-US", units: "imperial" },
  {language: "Finnish", locale: "fi-FI", units: "metric" },
  {language: "French", locale: "fr-FR", units: "metric" },
  {language: "German", locale: "de-DE", units: "metric" },
  {language: "Greek", locale: "el-GR", units: "metric" },
  {language: "Hindi", locale: "hi-IN", units: "metric" },
  {language: "Hungarian", locale: "hu-HU", units: "metric" },
  {language: "Italian", locale: "it-IT", units: "metric" },
  {language: "Japanese", locale: "ja-JP", units: "metric" },
  {language: "Korean", locale: "ko-KR", units: "metric" },
  {language: "Norwegian", locale: "no-NO", units: "metric" },
  {language: "Polish", locale: "pl-PL", units: "metric" },
  {language: "Portuguese", locale: "pt-PT", units: "metric" },
  {language: "Romanian", locale: "ro-RO", units: "metric" },
  {language: "Russian", locale: "ru-RU", units: "metric" },
  {language: "Slovak", locale: "sk-SK", units: "metric" },
  {language: "Spanish", locale: "es-ES", units: "metric" },
  {language: "Swedish", locale: "sv-SE", units: "metric" },
  {language: "Thai", locale: "th-TH", units: "metric" },
  {language: "Turkish", locale: "tr-TR", units: "metric" },
  {language: "Ukrainian", locale: "uk-UA", units: "metric" },
  {language: "Vietnamese", locale: "vi-VN", units: "metric" },
];

const weatherIcons = {
  "01d": "wi-day-sunny",
  "01n": "wi-night-clear",
  "02d": "wi-day-sunny-overcast",
  "02n": "wi-night-alt-partly-cloudy",
  "03d": "wi-day-cloudy",
  "03n": "wi-day-cloudy",
  "04d": "wi-cloudy",
  "04n": "wi-cloudy",
  "09d": "wi-day-showers",
  "09n": "wi-day-showers",
  "10d": "wi-day-rain",
  "10n": "wi-night-alt-rain",
  "11d": "wi-day-lightning",
  "11n": "wi-night-alt-lightning",
  "13d": "wi-day-snow",
  "13n": "wi-night-alt-snow",
  "50d": "wi-day-fog",
  "50n": "wi-night-fog"
};

window.onresize=()=>{
  location.reload();
}