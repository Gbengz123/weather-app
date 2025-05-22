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
  forecastCard.classList.add('load-container');

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
  createWindstatusElements();
  createUvIndexElements();
  createsunriseSunsetElements();
  createHumidityElements();
  createVisibilityElements();
  createSolarRadiationSection(
    `${dayData.solarradiation}<span>W/m2</span>`,
    'Normal',
  );

  function createWindstatusElements() {
    const windStatus = document.getElementById('wind-status');
    windStatus.innerHTML = '';

    const heading = document.createElement('h3');
    heading.className = 'highlight-heading';
    heading.textContent = 'Wind Status';

    // Create the container for wind info
    const highlightInfo = document.createElement('div');
    highlightInfo.className = 'highlight-info';

    // Create the speed info
    const speedInfo = document.createElement('div');
    speedInfo.className = 'info';
    speedInfo.innerHTML = `${dayData.windspeed}<span>km/h</span>`;

    // Create the direction-info container
    const directionInfo = document.createElement('div');
    directionInfo.id = 'direction-info';

    // Create the SVG element (as a string, then inserted as HTML)
    const svgHTML = `
    <svg id="direction" width="30px" height="30px" viewBox="0 0 24 24" fill="none"
        xmlns="http://www.w3.org/2000/svg" transform="rotate(225)">
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        <path d="M12 5V19M12 5L6 11M12 5L18 11" stroke="#000000" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round"></path>
      </g>
    </svg>
    `;

    // Insert SVG into direction-info
    directionInfo.innerHTML = svgHTML;

    // Create the direction label
    const directionValue = document.createElement('span');
    directionValue.id = 'direction-value';
    directionValue.textContent = 'SW';

    // Append direction label to direction-info
    directionInfo.appendChild(directionValue);

    // Assemble everything
    highlightInfo.appendChild(speedInfo);
    highlightInfo.appendChild(directionInfo);

    // Finally, append everything to the document
    windStatus.appendChild(heading);
    windStatus.appendChild(highlightInfo);
  }

  function createUvIndexElements() {
    const uvIndex = document.getElementById('uv-index');
    uvIndex.innerHTML = '';

    // Create heading
    const uvHeading = document.createElement('h3');
    uvHeading.className = 'highlight-heading';
    uvHeading.textContent = 'UV Index';

    // Create image
    const uvImage = document.createElement('img');
    uvImage.src = uvIcon;
    uvImage.alt = 'uv-icon';

    // Create the info container
    const uvInfo = document.createElement('div');
    uvInfo.className = 'highlight-info';
    uvInfo.textContent = dayData.uvindex;

    uvIndex.appendChild(uvHeading);
    uvIndex.appendChild(uvImage);
    uvIndex.appendChild(uvInfo);
  }

  function createsunriseSunsetElements() {
    const sunriseSunset = document.getElementById('sunrise-sunset');
    sunriseSunset.innerHTML = '';

    // Create the heading
    const heading = document.createElement('h3');
    heading.className = 'highlight-heading';
    heading.textContent = 'Sunrise & Sunset';

    // Create highlight-info container
    const highlightInfo = document.createElement('div');
    highlightInfo.className = 'highlight-info';

    // Helper function to create sunrise/sunset block
    function createSunInfo(id, imgSrc, time, duration) {
      const container = document.createElement('div');
      container.id = id;

      const img = document.createElement('img');
      img.src = imgSrc; // Set the src dynamically as needed
      img.alt = 'sunrise-img';

      const timeContainer = document.createElement('div');

      const h4 = document.createElement('h4');
      h4.textContent = time;

      const small = document.createElement('small');
      small.textContent = duration;

      timeContainer.appendChild(h4);
      timeContainer.appendChild(small);

      container.appendChild(img);
      container.appendChild(timeContainer);

      return container;
    }

    // Create sunrise and sunset blocks
    const sunriseBlock = createSunInfo(
      'sunrise-info',
      sunriseIcon,
      dayData.sunrise,
      '-1m 46s',
    );
    const sunsetBlock = createSunInfo(
      'sunset-info',
      sunsetIcon,
      dayData.sunset,
      '-1m 46s',
    );

    // Append blocks to highlight-info
    highlightInfo.appendChild(sunriseBlock);
    highlightInfo.appendChild(sunsetBlock);

    // Append everything to the document body (or a container)
    sunriseSunset.appendChild(heading);
    sunriseSunset.appendChild(highlightInfo);
  }

  function createHumidityElements() {
    const humidity = document.getElementById('humidity');
    humidity.innerHTML = '';

    // Create heading
    const humidityHeading = document.createElement('h3');
    humidityHeading.className = 'highlight-heading';
    humidityHeading.textContent = 'Humidity';

    // Create highlight-info container
    const highlightInfo = document.createElement('div');
    highlightInfo.className = 'highlight-info';

    // Create humidity info value
    const humidityInfo = document.createElement('div');
    humidityInfo.className = 'info';
    humidityInfo.innerHTML = `${dayData.humidity}<sup>%</sup>`; // Example value — update dynamically

    // Create humidity rating
    const humidityRating = document.createElement('span');
    humidityRating.className = 'info-rating';
    humidityRating.textContent = 'Normal'; // Example label — update as needed

    // Append info and rating to container
    highlightInfo.appendChild(humidityInfo);
    highlightInfo.appendChild(humidityRating);

    // Append heading and container to the document
    humidity.appendChild(humidityHeading);
    humidity.appendChild(highlightInfo);
  }

  function createVisibilityElements() {
    const visibilityContainer = document.getElementById('visibility');
    visibilityContainer.innerHTML = '';

    // Create heading
    const visibilityHeading = document.createElement('h3');
    visibilityHeading.className = 'highlight-heading';
    visibilityHeading.textContent = 'Visibility';

    // Create container for visibility info
    const visibilityInfoContainer = document.createElement('div');
    visibilityInfoContainer.className = 'highlight-info';

    // Create visibility value element
    const visibilityInfo = document.createElement('div');
    visibilityInfo.className = 'info';
    visibilityInfo.textContent = dayData.visibility; // Example value – replace as needed

    // Create visibility rating element
    const visibilityRating = document.createElement('span');
    visibilityRating.className = 'info-rating';
    visibilityRating.textContent = 'Normal'; // Can be "Good", "Poor", etc., based on conditions

    // Assemble the elements
    visibilityInfoContainer.appendChild(visibilityInfo);
    visibilityInfoContainer.appendChild(visibilityRating);

    // Append to document (or a specific container)
    visibilityContainer.appendChild(visibilityHeading);
    visibilityContainer.appendChild(visibilityInfoContainer);
  }

  function createSolarRadiationSection(value, rating) {
    const solarRadiation = document.getElementById('solar-radiation');
    solarRadiation.innerHTML = '';

    const heading = document.createElement('h3');
    heading.className = 'highlight-heading';
    heading.textContent = 'Solar Radiation';

    const container = document.createElement('div');
    container.className = 'highlight-info';

    const info = document.createElement('div');
    info.className = 'info';

    const span = document.createElement('span');
    span.innerHTML = value;

    info.appendChild(span);

    const ratingSpan = document.createElement('span');
    ratingSpan.className = 'info-rating';
    ratingSpan.textContent = rating;

    container.appendChild(info);
    container.appendChild(ratingSpan);

    solarRadiation.appendChild(heading);
    solarRadiation.appendChild(container);
  }
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
