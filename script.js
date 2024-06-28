document.addEventListener("DOMContentLoaded", () => {
  const secondHand = document.querySelector(".hand--second");
  const minuteHand = document.querySelector(".hand--minute");
  const hourHand = document.querySelector(".hand--hour");

  const temperatureBox = document.querySelector(".info__temperature");
  const locationBox = document.querySelector(".info__location");

  requestAnimationFrame(updateClock);

  function updateClock() {
    const currentDate = new Date();
    const ms = currentDate.getMilliseconds();
    const sec = currentDate.getSeconds();
    const min = currentDate.getMinutes();
    const hr = currentDate.getHours();

    secondHand.style.setProperty("--angle", (sec + ms / 1000) * 6 + "deg");
    minuteHand.style.setProperty("--angle", (min + sec / 60) * 6 + "deg");
    hourHand.style.setProperty("--angle", (hr + min / 60) * 30 + "deg");

    requestAnimationFrame(updateClock);
  }

  // handle location
  getLocation();

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }

  function showPosition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    console.log(lat, lon);
    getWeather(lat, lon);
  }

  function showError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        console.error("User denied the request for Geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
        console.error("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        console.error("The request to get user location timed out.");
        break;
      case error.UNKNOWN_ERROR:
        console.error("An unknown error occurred.");
        break;
    }
  }

  // handle weather
  const apiKey = "6583880417db4e9ebc1103137242806";

  async function getWeather(lat, lon) {
    const request = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}`;

    const response = await fetch(request);

    if (response.status == 200) {
      const weatherObject = await response.json();
      const location = weatherObject.location.name + ", " + weatherObject.location.country;
      const currentTemperature = weatherObject.current.temp_c;

      locationBox.append(location);
      temperatureBox.append(currentTemperature + "°C");
    }
  }
});
