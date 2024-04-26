const dateContainer = document.getElementById("dateContainer");
const date = document.getElementById("dateDate");
const dateDay = document.getElementById("dateDay");
const dateMonth = document.getElementById("dateMonth")
const dateYear = document.getElementById("dateYear");
const dateTime = document.getElementById("dateTime");

function drawDate() {
if (root.dateVisible)
  setDate();
}

function setDate() {
  const dt = new Date;
  date.textContent = dt.getDate();
  dateDay.textContent = dt.toLocaleString(root.locale.locale, {weekday: "long"});
  dateMonth.textContent = dt.toLocaleString(root.locale.locale, {month: "long"});
  dateYear.textContent = dt.getFullYear();
  dateTime.textContent = dt.toLocaleTimeString(root.locale.locale,{hour12: root.hour12, hour: "2-digit", minute:"2-digit" });
}

setInterval(drawDate, 1000);