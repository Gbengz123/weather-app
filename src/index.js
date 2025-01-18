import './style.css';
import './assets/fonts/OpenSans-Regular.ttf';

const Forcastdata = getForcastData();

export { Forcastdata }

async function getForcastData() {
  const weekData = await fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/abuja/next7days?unitGroup=us&key=MLFYNH7CZDJEDYWWDESDBLXVF&contentType=json`,
  );
  const weekJSONData = await weekData.json();

  const currentDayData = processcurrentDayData(weekJSONData);
  const currentweekData = processWeekData(weekJSONData);
  const hourlyData = processHourlyData(weekJSONData);

  return { currentDayData, currentweekData, hourlyData };
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
