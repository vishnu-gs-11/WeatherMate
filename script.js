function updateTimeDateDay() {
    let time = document.getElementById('time');
    let dateDay = document.getElementById('dateDay');
    const now = new Date();
    const timeOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }
    const dateDayOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }
    let nowTime = now.toLocaleDateString("en-US", timeOptions);
    let nowDateDay = now.toLocaleDateString("en-US", dateDayOptions);

    time.textContent = nowTime;
    dateDay.textContent = nowDateDay;
}
setInterval(updateTimeDateDay, 1000);
updateTimeDateDay();

//===========================================================================================
// weather details fetching and updating the UI 

let searchInput = document.getElementById('searchCity');
let searchButton = document.getElementById('searchButton');
let detectCurrentLocation = document.getElementById("detectCurrentLocationButton");
let cityName = document.getElementById('cityName');
let temperature = document.getElementById('temperature');
let weatherCondition = document.getElementById('weatherCondition');
let weatherIcon = document.getElementById('weatherIcon');
let humidity = document.getElementById('humidity');
let windSpeed = document.getElementById('windSpeed');
let uvIndex = document.getElementById('uvIndex');
let visibility = document.getElementById('visibility');

let addToFavourite = document.getElementById("addToFavouriteButton");

let favouriteCities = JSON.parse(localStorage.getItem('favouriteCities')) || [];

const API_KEY = "3045dd712ffe6e702e3245525ac7fa38";

function updateUI(data) {
    cityName.textContent = data.name;
    temperature.textContent = `${data.main.temp}°C`;
    weatherCondition.textContent = data.weather[0].description;
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
    windSpeed.textContent = data.wind.speed;
    humidity.textContent = data.main.humidity;
    visibility.textContent = data.visibility / 1000;

    if (favouriteCities.includes(data)) {
        addToFavourite.textContent = "Remove from favourite";
    } else {
        addToFavourite.textContent = "Add to favourite";
    }
}

async function fetchWeather(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`);
        const data = await response.json();
        if (response.ok) {
            updateUI(data);
        } else {
            alert("City Not Found! \n Check the spelling of the city");
        }
    } catch (error) {
        alert("Check your internet connection and try again later!");
    }
}

searchButton.addEventListener("click", () => {
    if (searchInput.value.trim !== "") {
        fetchWeather(searchInput.value);
    }
});

detectCurrentLocation.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const {
                latitude,
                longitude
            } = position.coords;

            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`)
                .then(response => response.json())
                .then(data => updateUI(data));
        })
    }
})

// ======================================================================================
// updation of BOOKMARKS (favourite container)

let favouriteList = document.getElementById("favouriteList");

function updateFavouriteUI() {
    favouriteList.innerHTML = "";
    favouriteCities.forEach(city => {
        let listItem = document.createElement("li");
        listItem.textContent = city;
        listItem.addEventListener("click", () => fetchWeather(city));

        let removeBtn = document.createElement("button");
        removeBtn.textContent = "X";
        removeBtn.addEventListener("click", () => removeFromFavourites(city));

        listItem.appendChild(removeBtn);
        favouriteList.appendChild(listItem);
    });
}

addToFavourite.addEventListener("click", () => {
    let currentCity = cityName.textContent;
    if (!currentCity) return;

    if (favouriteCities.includes(currentCity)) {
        removeFromFavourites(currentCity);
    } else {
        addToFavourites(currentCity);
    }
});

function addToFavourites(city) {
    if (!favouriteCities.includes(city)) {
        favouriteCities.push(city);
        localStorage.setItem("favouriteCities", JSON.stringify(favouriteCities));
        updateFavouriteUI();
        addToFavourite.textContent = "Remove from favourite";
    }
}

function removeFromFavourites(city) {
    favouriteCities = favouriteCities.filter(favCity => favCity !== city);
    localStorage.setItem("favouriteCities", JSON.stringify(favouriteCities));
    updateFavouriteUI();
    addToFavourite.textContent = "Add to favourite";
}

// ========================================================================================
// DARK MODE chaning and reverting

let darkModeToggle = document.getElementById("darkModeToggle");
if (localStorage.getItem("dark-mode") === "enabled") {
    document.body.classList.add("dark-mode");
}
darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("dark-mode", "enabled");
    } else {
        localStorage.setItem("dark-mode", "disabled");
    }
});
