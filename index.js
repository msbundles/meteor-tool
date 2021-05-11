const url = new URL('https://data.nasa.gov/resource/gh4g-9sfh.json?');
// Var pointing to the form
const form = document.querySelector('#form');
// Input from form
const input = document.querySelector('input[name=\'radius\']');
const request = new XMLHttpRequest();
// Credit for these functions goes to http://www.movable-type.co.uk/scripts/latlong.html
// I edited them a bit, but wanted to give credit
function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
      + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2))
      * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d;
}

// Function that runs when the geolocation fails
function error() {
  alert('Unable to retrieve your location');
}

// Function that runs when geolocation succeeds
function success(position) {
  const ylatitude = position.coords.latitude;
  const ylongitude = position.coords.longitude;
  const data = JSON.parse(request.response);
  for (let i = 0; i < data.length; i++) {
    console.log('Data iteration loop ran');
    const dist = getDistanceKm(ylatitude, ylongitude, data[i].reclat, data[i].reclong);
    console.log(dist);
    // Checking if the meteor is within the radius
    if (dist < input.value) {
      console.log(data[i]);
      console.log('There are meteors in selected the radius');
      if (data[i].mass === undefined) {
        data[i].mass = 'Unknown';
      }
      // Inserting the data into the table
      $('#datatable').append(`
<tr>
  <td>${data[i].name}</td>
  <td>${data[i].mass}</td>
  <td>${data[i].year}</td>
  <td>${data[i].reclat}</td>
  <td>${data[i].reclong}</td>
</tr>
`);
    } else {
      console.log('There are no meteors in the radius');
    }
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  $('#datatable td').parent().remove();
  request.open('GET', url, true);
  request.onload = () => {
    // If geolocation not supported tell the user
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
    } else {
      // If it is, get the lat and long and parse the json
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };
  request.send();
});
