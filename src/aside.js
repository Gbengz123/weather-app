import { Forcastdata, loadSVG } from '.';
import { format } from 'date-fns';

const asideShowcase = document.getElementById('day-showcase');
const showcaseTemp = asideShowcase.querySelector('.temp');
const showcaseTime = asideShowcase.querySelector('#time');
const showcaseImage = asideShowcase.querySelector('#current-weather-svg');
const showcaseCondition = asideShowcase.querySelector('#condition');

const locationContainer = document.getElementById('location');
const tommorowForcast = document.getElementById('tomorrow-temp');
const tommorowDate = tommorowForcast.querySelector('small');
const tommorowTemp = tommorowForcast.querySelector('.temp');
const tommorowForcastIcon = tommorowForcast.querySelector(
  '#tomorrow-forcast-icon',
);

async function displayAsideData() {
  const currentdayData = (await Forcastdata).currentDayData;
  const weekData = (await Forcastdata).currentweekData;
  const addressData = (await Forcastdata).address;

  displayAsideShowcase(currentdayData);
  displayAsidebBottom(weekData, addressData);
}

export default displayAsideData;

//Displays aside showcase data
function displayAsideShowcase(dayData) {
  loadSVG(`${dayData.icon}.svg`, showcaseImage.id);

  showcaseTemp.innerHTML = `${dayData.temp}<sup>&deg;C</sup>`;

  showcaseCondition.textContent = dayData.conditions;

  // Create a new Date object (current date and time)
  const now = new Date();
  // Format the date as "Monday, 19:00"
  const formattedDate = format(now, 'EEEE, HH:mm');
  const [day, time] = formattedDate.split(' ');
  showcaseTime.innerHTML = `<span>${day}</span> ${time}`;
}

//Display aside bottom data
function displayAsidebBottom(weekData, addressData) {
  const tommorow = weekData[1];

  const date = new Date(tommorow.datetime);

  // Convert to dd-mm-yyyy to Month Day e.g January 19
  const options = { month: 'long', day: 'numeric' };
  const formattedDate = date.toLocaleDateString('en-US', options);

  tommorowDate.textContent = formattedDate;

  tommorowTemp.innerHTML = `${tommorow.temp}&deg;C`;

  loadSVG(`${tommorow.icon}.svg`, tommorowForcastIcon.id);

  locationContainer.textContent = addressData.resolvedAddress;
}
