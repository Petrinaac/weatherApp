$(document).ready(function(){
  const iconElement = $(".weather-icon");
  const tempElement = $(".temp p");
  const descElement = $(".temp-description p");
  const locationElement = $(".location p");
  const notificationElement = $(".notification");

  const weather = {};

  weather.temperature = {
      unit : "celsius"
  }

  const KELVIN = 273.15;
  const key = "82005d27a116c2880c8f0fcb866998a0";



  if('geolocation' in navigator){
      navigator.geolocation.getCurrentPosition(setPosition, showError);
  } else{
      notificationElement.css("display", "block");
      notificationElement.html("<p>Browser doesn't Support Geolocation</p>");
  }



  function setPosition(position){
      let latitude = position.coords.latitude;
      let longitude = position.coords.longitude;

      getWeather(latitude, longitude);
  }



  function showError(error){
      notificationElement.css("display", "block");
      notificationElement.html(`<p> ${error.message} </p>`);
  }



  function getWeather(latitude, longitude){
      let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;

      fetch(api)
          .then(function(response){
              let data = response.json();
              return data;
          })
          .then(function(data){
              weather.temperature.value = Math.floor(data.main.temp - KELVIN);
              weather.description = data.weather[0].description;
              weather.iconId = data.weather[0].icon;
              weather.city = data.name;
              weather.country = data.sys.country;
          })
          .then(function(){
              displayWeather();
          });
  }



  function displayWeather(){
      iconElement.html(`<img src="icons/${weather.iconId}.png"/>`);
      tempElement.html(`${weather.temperature.value}°<span>C</span>`);
      descElement.html(weather.description);
      locationElement.html(`${weather.city}, ${weather.country}`);
  }



  function celsiusToFahrenheit(temperature){
      return (temperature * 9/5) + 32;
  }



  tempElement.on("click", function(){
      if(weather.temperature.value === undefined) return;

      if(weather.temperature.unit == "celsius"){
          let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
          fahrenheit = Math.floor(fahrenheit);

          tempElement.html(`${fahrenheit}°<span>F</span>`);
          weather.temperature.unit = "fahrenheit";
      }else{
          tempElement.html(`${weather.temperature.value}°<span>C</span>`);
          weather.temperature.unit = "celsius"
      }
  });
});