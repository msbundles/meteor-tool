let url = new URL("https://data.nasa.gov/resource/gh4g-9sfh.json?");
//Var pointing to the form
const form = document.querySelector('#form');
//Input from form
var input = document.querySelector('input[name="radius"]');
let request = new XMLHttpRequest();
//Credit for these functions goes to http://www.movable-type.co.uk/scripts/latlong.html
//I edited them a bit, but wanted to give credit
function deg2rad(deg) {
    return deg * (Math.PI/180)
}

function getDistanceKm(lat1,lon1,lat2,lon2) {
    let R = 6371;
    let dLat = deg2rad(lat2-lat1);
    let dLon = deg2rad(lon2-lon1);
    let a =
	Math.sin(dLat/2) * Math.sin(dLat/2) +
	Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
	Math.sin(dLon/2) * Math.sin(dLon/2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    let d = R * c;
    return d;
}

//Function that runs when the geolocation fails
function error() {
    alert('Unable to retrieve your location');
}

//Function that runs when geolocation succeeds
function success(position) {
    const ylatitude  = position.coords.latitude;
    const ylongitude = position.coords.longitude;
    let data = JSON.parse(request.response);
    for (let i = 0; i < data.length; i++){
	console.log('Data iteration loop ran');
	let dist = getDistanceKm(ylatitude,ylongitude,data[i].reclat,data[i].reclong);
	console.log(dist);
	//Checking if the meteor is within the radius
	if (dist < input.value){
	    console.log(data[i]);
	    console.log('There are meteors in selected the radius');
	    //Inserting the data into the table
	    $("#datatable").append(`
<tr>
  <td>${data[i].name}</td>
  <td>${data[i].mass}</td>
  <td>${data[i].year}</td>
  <td>${data[i].reclat}</td>
  <td>${data[i].reclong}</td>
</tr>
`);
	}
	else {
	    console.log('There are no meteors in the radius');
	} 
    }
}

form.addEventListener('submit', event => {
    event.preventDefault();
    $("#datatable td").parent().remove();
    request.open('GET', url, true);
    request.onload = function () {
	//If geolocation not supported tell the user
	if(!navigator.geolocation) {
	    alert('Geolocation is not supported by your browser');
	} else {
	    //If it is, get the lat and long and parse the json
	    navigator.geolocation.getCurrentPosition(success, error);
	}
    }
    request.send();
});

