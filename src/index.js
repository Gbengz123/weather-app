import './style.css';
import './assets/fonts/OpenSans-Regular.ttf';
import displayAsideData from './aside';
import dispalyMain from './main';
//Imports url of all svg files
// By using svgname.svg we get url to the svg i.e http://localhost:3000/svgname.svg
const svgFiles = require.context(
  './assets/WeatherIcons/SVG/1stSet-Color',
  false,
  /\.svg$/,
);

const searchBar = document.getElementById('search-bar');
const searchBarInput = document.querySelector('input');
const searchErrMsg = document.getElementById('search-err');
const loadContainers = document.querySelectorAll('.load-container');
const errorMessage = document.getElementById('error-msg');

searchBar.addEventListener('submit', searchForcast);

let Forcastdata = getForcastData('minna');
console.log(Forcastdata);
displayAsideData();
dispalyMain();

export { Forcastdata, loadSVG, toggleButtton };

function searchForcast(event) {
  event.preventDefault();

  const toggleButttons = document.querySelectorAll('.toggle-btn');

  if (searchBarInput.value === '' || searchBarInput.value === null) {
    searchErrMsg.textContent = 'Please enter a location';
  } else {
    searchErrMsg.textContent = '';

    Forcastdata = getForcastData(`${searchBarInput.value}`);

    Forcastdata.then((data) => {
      if (data === undefined) {
        toggleButttons.forEach((button) => {
          button.disabled = true;
        });
      } else {
        searchBarInput.value = '';

        toggleButttons.forEach((button) => {
          button.disabled = false;
        });

        displayAsideData();
        dispalyMain();
      }
    });
  }
}

//Used to fetch forecast data from the API
async function getForcastData(location) {
  try {
    //This will return a response object uncomment the console.log to see
    const weekData = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/next7days?unitGroup=metric&key=MLFYNH7CZDJEDYWWDESDBLXVF&contentType=json`,
    );

    //Console.log(weekData)

    //Check if the weekData response is OK (i.e we got an ok response)
    if (!weekData.ok) {
      if (weekData.status === 400) {
        console.error('user inputed bad reqeust');
      }
      searchErrMsg.textContent = 'location can not be found';
      throw new Error(`Request failed with status ${weekData.status}`);
    }

    loadContainers.forEach((container) => {
      container.classList.remove('loading');
    });

    errorMessage.style.display = 'none';

    // This parses the response body as JSON and returns a promise Object with our data as the result
    const weekJSONData = await weekData.json();

    const currentDayData = processcurrentDayData(weekJSONData);
    const currentweekData = processWeekData(weekJSONData);
    const hourlyData = processHourlyData(weekJSONData);
    const address = processcurrentAddress(weekJSONData);

    console.log(address);

    return { currentDayData, currentweekData, hourlyData, address };
  } catch (error) {
    //Catch for when we have a network error
    if (error instanceof TypeError) {
      console.error('Likely network error or CORS issue:', error.message);
      errorMessage.style.display = 'flex';
    } else {
      console.error('Unexpected error:', error.message);
    }
  }
}

// Used to get current day data needed
function processcurrentDayData(weekData) {
  const currentDayData = filterObject(
    'temp',
    'feelslike',
    'humidity',
    'windspeed',
    'sunrise',
    'sunset',
    'icon',
    'uvindex',
    'visibility',
    'conditions',
    'cloudcover',
    'solarradiation',
    weekData.currentConditions,
  );

  return currentDayData;
}

// Used to get current week data needed
function processWeekData(weekData) {
  let weekdaysData = [];

  weekData.days.forEach((day) => {
    const dayObject = filterObject(
      'datetime',
      'temp',
      'feelslike',
      'icon',
      day,
    );

    dayObject.day = getDayName(dayObject.datetime);

    weekdaysData.push(dayObject);
  });

  return weekdaysData;
}

//Used to get hourly data needed
function processHourlyData(weekData) {
  let hourlyData = [];

  // Get hourly data for current day
  weekData.days[0].hours.forEach((hour) => {
    const hourObject = filterObject(
      'datetime',
      'temp',
      'feelslike',
      'icon',
      hour,
    );

    // Reduces time from 00:00:00 to 00:00
    hourObject.datetime = hourObject.datetime.split(':').slice(0, 2).join(':');

    hourlyData.push(hourObject);
  });

  return hourlyData;
}

function processcurrentAddress(weekData) {
  const addressObject = filterObject(
    'resolvedAddress',
    'address',
    'timezone',
    weekData,
  );

  return addressObject;
}

// Gets specific day fom date yyyy-mm-dd
function getDayName(date) {
  const dateObject = new Date(date); // Convert string to Date object
  // Array of day names corresponding to getDay() values (0 = Sunday, 1 = Monday, etc.)
  const dayNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  // Get the day name
  let dayName = dayNames[dateObject.getDay()];

  return dayName;
}

function filterObject(...porpkeys) {
  // Get original object you want to filter which is the last argument
  const originalObj = porpkeys.pop();

  // Create filtered object based on propkeys inputed
  const filteredObject = Object.entries(originalObj)
    .filter(([key]) => porpkeys.includes(key))
    .reduce((obj, [key, value]) => {
      obj[key] = value;
      return obj;
    }, {});

  return filteredObject;
}

function loadSVG(url, containerId) {
  fetch(url)
    .then((res) => res.text())
    .then((svgText) => {
      // Clean up the SVG by removing escape characters
      let cleanedSvgText = svgText.replace(/\\\"/g, '"'); // Replace \\\" with "
      cleanedSvgText = cleanedSvgText.replace(/\\'/g, "'"); // Replace \\' with '

      // Remove any extra unwanted characters like 'module.exports ='
      cleanedSvgText = cleanedSvgText.replace(/^module\.exports = /, '').trim();

      // You can also further clean if necessary (e.g., replacing extra spaces, newlines, etc.)
      // For example, fixing the 'viewBox' if needed:
      cleanedSvgText = cleanedSvgText.replace(/viewBox="\\\"0/g, 'viewBox="0'); // Fix malformed viewBox\\

      cleanedSvgText = cleanedSvgText.slice(1, -1);

      // Insert the cleaned SVG into your container
      const container = document.getElementById(containerId);
      container.innerHTML = cleanedSvgText;
    })
    .catch((error) => {
      console.error('Error loading SVG:', error);
    });
}

function toggleButtton(button, allbuttons) {
  button.addEventListener('click', () => {
    // Remove active state of all buttons
    allbuttons.forEach((button) => {
      button.classList.remove('active');
    });

    // Add active state to clicked button
    button.classList.add('active');
  });
}
