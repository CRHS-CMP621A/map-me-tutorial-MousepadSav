'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');




let workouts = []
let map;
let mapEvent;



class Workout {
    date = new Date();
    id = (Date.now() + '').slice(-10);

    constructor(coords, distance, duration) {
        this.coords = coords;
        this.distance = distance;
        this.duration = duration;
    }
}

class Running extends Workout {
    constructor(coords, distance, duration, cadence) {
        super(coords, distance, duration);
        this.cadence = cadence;
    }
}

class Cycling extends Workout {
    constructor(coords, distance, duration, elevationGain) {
        super(coords, distance, duration);
        this.elevation = elevationGain;
    }
}

//test
const run1 = new Running([39, -12], 5.2, 24, 178)
const cycling1 = new Cycling([39, -12], 27, 95, 523)

console.log(run1, cycling1)

navigator.geolocation.getCurrentPosition(
    function (position) {
        console.log(position);
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const coords = [latitude, longitude]
        console.log(`https://www.google.com/maps/@${coords},15z`)

        map = L.map('map').setView(coords, 13);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        L.marker(coords).addTo(map)
            .bindPopup('A pretty CSS popup.<br> Easily customizable.')
            .openPopup();

        map.on('click', function (mapE) {
            mapEvent = mapE
            form.classList.remove('hidden');
            inputDistance.focus();

        })



    },
    function () {
        alert('Could not get position.');
    }
);

// form event listener to check if submitted/completed
form.addEventListener('submit', function (e) {
    e.preventDefault()
    const type = inputType.value;
    const distance = Number(inputDistance.value)
    const duration = Number(inputDuration.value)

    const lat = mapEvent.latlng.lat
    const lng = mapEvent.latlng.lng

    let workout;

    if (type == 'running') {
        const cadence = Number(inputCadence.value)

        //validate form data later

        workout = new Running([lat, lng], distance, duration, cadence)
        workouts.push(workout)
    }

    if (type == 'cycling') {
        const elevation = +inputElevation.value;

        workout = new Cycling([lat, lng], distance, duration, elevation)
        workouts.push(workout)
        console.log(workouts)
    }

    console.log(mapEvent)

    L.marker([lat, lng]).addTo(map)
        .bindPopup(L.popup({
            maxWidth: 250,
            minWidth: 100,
            autoClose: false,
            closeOnClick: false,
            className: 'running-popup',
        }))
        .setPopupContent('Workout')
        .openPopup();
    form.reset()
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
})

//Event Listener Toggle form input type change. 

inputType.addEventListener('change', function () {
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
})

