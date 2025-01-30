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

const Forcastdata = getForcastData();
displayAsideData();
dispalyMain();

export { Forcastdata, loadSVG };

async function getForcastData() {
  try {
    const weekData = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/abuja/next7days?unitGroup=metric&key=MLFYNH7CZDJEDYWWDESDBLXVF&contentType=json`,
    );
    const weekJSONData = await weekData.json();

    const currentDayData = processcurrentDayData(weekJSONData);
    const currentweekData = processWeekData(weekJSONData);
    const hourlyData = processHourlyData(weekJSONData);

    return { currentDayData, currentweekData, hourlyData };
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

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
    weekData.currentConditions,
  );

  return currentDayData;
}

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
