//Put your API key ↓ 
const apiKey = "";


let countryCode = "";
let cityName = "";
let stateCode = "";
let limit = 5;
let us = "United States"; 


//Used on lines 73, 90, 218, 247
let inUs = false;

//Used on lines 194, 227, 237
const savedLocationsList = [];

//Used on line 178
const bg = document.getElementById("body");

//Used on lines 186, 187, 195, 201, 268
let selectData;

//Used on line 67, 68, 213, 214
const statesList = [
    "alabama", "alaska", "arizona", "arkansas", "california", "colorado", "connecticut", "delaware", "florida", "georgia",
    "hawaii", "idaho", "illinois", "indiana", "iowa", "kansas", "kentucky", "louisiana", "maine", "maryland",
    "massachusetts", "michigan", "minnesota", "mississippi", "missouri", "montana", "nebraska", "nevada", "new hampshire", "new jersey",
    "new mexico", "new york", "north carolina", "north dakota", "ohio", "oklahoma", "oregon", "pennsylvania", "rhode island", "south carolina",
    "south dakota", "tennessee", "texas", "utah", "vermont", "virginia", "washington", "west virginia", "wisconsin", "wyoming"
];

//Gets the current time. (hours and minutes)
function getTime() {
    let currentDate = new Date();
    let hours = currentDate.getHours();
    let minutes = currentDate.getMinutes();
    if (hours > 12) {
        hours -= 12;
    }
    if (minutes < 10) {
        minutes = "0" + minutes.toString();
    }
    let currentTime = `${hours}:${minutes}`;

    return currentTime;
}


//Converts kelvin to fahrenheit
function kelvinToFahrenheit(kelvinTemp) {
    const fahrenheit = (kelvinTemp - 273.15) * 9/5 + 32;
    return fahrenheit;
}


//Gets data from submitted form
document.getElementById("formId").addEventListener('submit', function(event) {

    //Prevents data from going into search bar
    event.preventDefault();

    countryCode = document.getElementById("country").value.toLocaleLowerCase();
    cityName = document.getElementById("city").value.toLocaleLowerCase();


    //Checks if what you entered as country is a state
    for (let i = 0; i < statesList.length; i++) {
        if (countryCode == statesList[i]) {

            inUs = true;
            stateCode = countryCode;
            countryCode = "United States";
            break;
        }
    }

    //Calls function to get lat and lon with submitted data
    getGeocodeLocation(cityName, stateCode, countryCode);

});

//Gets lat and lon from city
function getGeocodeLocation(cityName, stateCode, countryCode) {

    let geocodeUrl;
        
    if (inUs === true) {
        //Including state
        geocodeUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName},${stateCode},${us}&limit=${limit}&appid=${apiKey}`;
    }
    else {
        geocodeUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName},${countryCode}&limit=${limit}&appid=${apiKey}`;
    }


    //Gets latitude and longitude and calls getWeatherData with those values as parameters
    fetch(geocodeUrl)
    .then((res) => {
        return res.json();
    })
    .then((data) => {
        const lat = data[0].lat;
        const lon = data[0].lon;
        getWeaterData(lat, lon);
    })
    .catch((err) => {
            console.error(err);
    });


    //Selects any new displayed info and deletes it before getting new info
    const displayedInfo = document.getElementById("weatherInfo");
    displayedInfo.innerHTML = "";

}    


//Fetches weather data using latitude in longitude from getGeocodeLocation
function getWeaterData(lat, lon) {

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    
    fetch(url)
    .then((res) => {
        return res.json();
    })
    .then((data) => {
        displayWeather(data);
    })
    .catch((err) => {
        console.error(err);
    });
}

//Displays city name, temperature in fahrenheit, and weather description
function displayWeather(data) {
        
    const temp = Math.floor(kelvinToFahrenheit(data.main.temp));
    const detailedWeater = data.weather[0].description;
    const mainWeather = data.weather[0].main;

    //Current city
    const displayCity = document.createElement("h1");
    displayCity.textContent = cityName;
    displayCity.style.fontSize = "3rem";
    displayCity.style.textShadow = "-1.5px -1.5px 0 #000000, 1.5px -1.5px 0 #000000";

    //Temperature in fahrenheit
    const h2 = document.createElement("h2");
    h2.textContent = temp + "°";
    h2.style.fontSize = "4rem";
    h2.style.textShadow = "-1.9px -1.9px 0 #000000, 1.9px -1.9px 0 #000000";

    //Description of weather
    const weatherDesc = document.createElement("p");
    weatherDesc.textContent = detailedWeater;
    weatherDesc.style.fontSize = "1.5rem";
    weatherDesc.style.textShadow = "-1.4px -1.4px 0 #000000, 1.4px -1.4px 0 #000000";

    //Shows time of last update
    const lastUpdated = `Last update: ${getTime()}`;
    const displayTime = document.createElement("h4");
    displayTime.textContent = lastUpdated;
    displayTime.style.textShadow = "-1.4px -1.4px 0 #000000, 1.4px -1.4px 0 #000000";

    //Select div in html to display weather data
    const container = document.getElementById("weatherInfo");
    container.innerHTML = "";
    container.appendChild(displayCity);
    container.appendChild(h2);
    container.appendChild(weatherDesc);
     container.appendChild(displayTime);

    //Calls function to change background image
    bg.style.backgroundImage = getBackgroundImage(mainWeather);


}
    

//Saves locations to be selected with select tag
function displaySavedLocations() {

    //Selects displayed information and removes it
    selectData = document.getElementById("savedLocations");
    selectData.innerHTML = "";

        
    // Creates a new option for each saved location
    savedLocationsList.forEach((location, index) => {
        const newOption = document.createElement("option");
        newOption.value = index;
        newOption.textContent = location.city;
        selectData.appendChild(newOption);
    });

    // Append select element to the form
    const formSelect = document.getElementById("formSelect");
    formSelect.innerHTML = "";
    formSelect.appendChild(selectData);

}
    
    
//Adds location to select tag when save button is pressed
document.getElementById("save").addEventListener("click", () => {

    cityName = document.getElementById("city").value.toLocaleLowerCase();
    countryCode = document.getElementById("country").value.toLocaleLowerCase();
    
    // Check if countryCode is a state
    for (let i = 0; i < statesList.length; i++) {
        if (countryCode === statesList[i]) {
            inUs = true;
            stateCode = countryCode;
            countryCode = "United States";
            break;
        }
        }
    
    // Add the new location to savedLocationsList
    const savedLocation = { city: cityName, state: stateCode, country: countryCode };
    savedLocationsList.push(savedLocation);

    displaySavedLocations();
});


//Adds info to form of selected option
function optionSelect(event) {

    const selectedOptionIndex = event.target.value;
    const selectedLocation = savedLocationsList[selectedOptionIndex];

    const selectedCity = selectedLocation.city;
    const selectedCountry = selectedLocation.country;
    const selectedState = selectedLocation.state;

    document.getElementById("city").value = selectedCity;
                
                
    //If the location is in the US, sets country name to state name
    if(inUs === true) {
        document.getElementById("country").value = selectedState;
    }

    else {
        document.getElementById("country").value = selectedCountry;
    }
                
}

//Delete item from select tag
document.getElementById("delete").addEventListener("click", function() {

    const selectElement = document.getElementById("savedLocations");
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    selectElement.removeChild(selectedOption);

});


//Calls previous function when you select an option
document.getElementById("savedLocations").addEventListener("change", optionSelect);

//Adds weather data to div in html
document.getElementById("weatherInfo").appendChild(selectData);

//Change background image based on weather
function getBackgroundImage(mainWeather) {
    switch (mainWeather) {
        case "Rain":
            return "url('rain.gif')";
        case "Clear":
            return "url('clear.jpg')";
        case "Thunderstorm":
            return "url('thunder.gif')";
        case "Drizzle":
            return "url('drizzle.gif')";
        case "Snow":
            return "url('snow.gif')";
        case "Clouds":
            return "url('clouds.gif')";
        default:
            return "url('basic.jpg')";
    }
}
            


