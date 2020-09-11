let url = new URL("https://data.nasa.gov/resource/gh4g-9sfh.json?");
const form = document.querySelector('#form');
let input = document.querySelector('input[name="radius"]');
let request = new XMLHttpRequest();
form.addEventListener('submit', event => {
    event.preventDefault()
    request.open('GET', url, true);
    request.onload = function () {

    }
    request.send();
})

