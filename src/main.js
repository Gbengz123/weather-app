import { loadSVG, Forcastdata } from '.';
const showcaseContainer = document.getElementById('showcase-container');
const toggleButttons = document.querySelectorAll('.toggle-btn');

async function dispalyMain() {
  const weekData = (await Forcastdata).currentweekData;
  const hourlyData = (await Forcastdata).hourlyData;
  const dayData = (await Forcastdata).currentDayData;

  loadShowcaseData(weekData, 'day');
  loadTodaysHighlights(dayData);

  toggleButttons.forEach((button) => {
    button.addEventListener('click', () => {
      // Remove active state of all buttons
      toggleButttons.forEach((button) => {
        button.classList.remove('active');
      });

      // Add active state to clicked button
      button.classList.add('active');

      // Laoad Data
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

  console.log(uvIndex);

  windStatusInfo.innerHTML = `${dayData.windspeed}<span>km/h</span>`;
  uvIndexInfo.textContent = dayData.uvindex;
}
