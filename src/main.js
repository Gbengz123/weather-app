import { loadSVG, Forcastdata, toggleButtton } from '.';
import sunriseIcon from './assets/WeatherIcons/PNG/sunrise.png';
import sunsetIcon from './assets/WeatherIcons/PNG/sunset.png';
import uvIcon from './assets/WeatherIcons/PNG/uvIndex.png';
import displayAsideData from './aside';
const showcaseContainer = document.getElementById('showcase-container');
const tempButtons = document.querySelectorAll('.temp-button');
const toggleButttons = document.querySelectorAll('.toggle-btn');

let tempStatus;

async function dispalyMain() {
  const weekData = (await Forcastdata).currentweekData;
  const hourlyData = (await Forcastdata).hourlyData;
  const dayData = (await Forcastdata).currentDayData;

  //Make week toggle button active since we are loading week data first
  toggleButttons.forEach((button) => {
    button.classList.remove('active');
  });
  toggleButttons[1].classList.add('active');

  loadShowcaseData(weekData, 'day');
  loadTodaysHighlights(dayData);

  //Coontrol active state for temp convert buttons at the top of the page
  tempButtons.forEach((button) => {
    toggleButtton(button, tempButtons);

    button.addEventListener('click', (e) => convertTemp(e));
  });

  toggleButttons.forEach((button) => {
    toggleButtton(button, toggleButttons);

    // Load Data
    button.addEventListener('click', () => {
      tempButtons.forEach((button) => {
        button.classList.remove('active');
      });

      // Add active state to degrees Celcius button as default
      tempButtons[0].classList.add('active');
      tempStatus = tempButtons[0].id;
      displayAsideData();
      if (button.id === 'today') {
        loadShowcaseData(hourlyData, 'datetime');
      } else if (button.id === 'week') {
        loadShowcaseData(weekData, 'day');
      }
    });
  });
}

export default dispalyMain;

function loadShowcaseData(periodData, period) {
  showcaseContainer.innerHTML = '';

  for (let i = 0; i < periodData.length; i++) {
    createShowcaseCard();
  }

  const forcastIcons = document.querySelectorAll('.forcast-icon');
  const forcastDays = document.querySelectorAll('.forcast-period');
  const forcastTemp = document.querySelectorAll('.forcast-temp');

  //Give each icon an id
  forcastIcons.forEach((icon, index) => {
    icon.id = periodData[index][period];
    if (index === 7) {
      icon.id = `${periodData[index][period]}2`;
    }
  });

  // Load svg of each icon
  forcastIcons.forEach((icon, index) => {
    loadSVG(`${periodData[index].icon}.svg`, icon.id);
  });

  // Loads days
  forcastDays.forEach((day, index) => {
    day.textContent = periodData[index][period];
  });

  // Loads temp
  forcastTemp.forEach((temp, index) => {
    temp.innerHTML = `${periodData[index].temp}&deg;C`;
  });
}

function createShowcaseCard() {
  // Create the main forecast card container
  const forecastCard = document.createElement('div');
  forecastCard.classList.add('forcast-card');

  // Create the forecast period h4 element
  const forecastPeriod = document.createElement('h4');
  forecastPeriod.classList.add('forcast-period');

  // Create the forecast icon div
  const forecastIcon = document.createElement('div');
  forecastIcon.classList.add('forcast-icon');

  // Create the forecast temperature div
  const forecastTemp = document.createElement('div');
  forecastTemp.classList.add('forcast-temp');
  forecastTemp.classList.add('temp');

  // Append all the created elements to the forecast card
  forecastCard.appendChild(forecastPeriod);
  forecastCard.appendChild(forecastIcon);
  forecastCard.appendChild(forecastTemp);

  showcaseContainer.appendChild(forecastCard);
}

function loadTodaysHighlights(dayData) {
  console.log(dayData);
  const windStatus = document.getElementById('wind-status');
  const windStatusInfo = windStatus.querySelector('.info');
  const uvIndex = document.getElementById('uv-index');
  const uvIndexInfo = uvIndex.querySelector('.highlight-info');
  const uvIndexIcon = uvIndex.querySelector('img');
  const sunriseSunset = document.getElementById('sunrise-sunset');
  const sunriseSunsetIcons = sunriseSunset.querySelectorAll('img');
  const sunrisesunsetTime = sunriseSunset.querySelectorAll('h4');
  const humidity = document.getElementById('humidity');
  const humidityInfo = humidity.querySelector('.info');
  const visibility = document.getElementById('visibility');
  const visibilityInfo = visibility.querySelector('.info');
  const solarRadiation = document.getElementById('solar-radiation');
  const solarRadiationInfo = solarRadiation.querySelector('.info');

  console.log(sunriseSunsetIcons);

  windStatusInfo.innerHTML = `${dayData.windspeed}<span>km/h</span>`;
  uvIndexInfo.textContent = dayData.uvindex;
  uvIndexIcon.src = uvIcon;
  sunriseSunsetIcons[0].src = sunriseIcon;
  sunriseSunsetIcons[1].src = sunsetIcon;
  sunrisesunsetTime[0].textContent = dayData.sunrise;
  sunrisesunsetTime[1].textContent = dayData.sunset;
  humidityInfo.innerHTML = `${dayData.humidity}<sup>%</sup>`;
  visibilityInfo.textContent = dayData.visibility;
  solarRadiationInfo.innerHTML = `${dayData.solarradiation}<span>W/m2</span>`;
}

function convertTemp(e) {
  // If the button is already active (disabled), and tempstatus is still the same do nothing
  if (e.target.classList.contains('active') && tempStatus === e.target.id) {
    return;
  }

  // Disable the button to prevent further clicks

  const forcastTemps = document.querySelectorAll('.temp');
  let convertedTemps = [];
  let temp;

  forcastTemps.forEach((forcastTemp) => {
    temp = forcastTemp.textContent.replace(/[^0-9.]/g, '');
    temp = convert(temp).toFixed(1);
    convertedTemps.push(temp);
  });

  forcastTemps.forEach((forcastTemp, index) => {
    if (e.target.id === 'F') {
      forcastTemp.innerHTML = `${convertedTemps[index]}&deg;F`;
    } else if (e.target.id === 'C') {
      forcastTemp.innerHTML = `${convertedTemps[index]}&deg;C`;
    }
  });

  function convert(temp) {
    if (e.target.id === 'F') {
      // Convert to celcius
      return (temp * 9) / 5 + 32;
    } else if (e.target.id === 'C') {
      return ((temp - 32) * 5) / 9;
    }
  }

  tempStatus = e.target.id;

  console.log(convertedTemps);
}
