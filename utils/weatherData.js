const request = require("request");

const openWeatherMap = {
    BASE_URL: "https://api.openweathermap.org/data/2.5/weather?q=",
    SECRET_KEY: "5208d5c5ab00430e4dccaf92fb1bb047"
}

const weatherData = (address, callback) => {
    const url = openWeatherMap.BASE_URL + 
    encodeURIComponent(address) + 
    "&APPID=" + 
    openWeatherMap.SECRET_KEY;
    console.log(url);
    
    request({url, json: true}, (error, data) => {
        if(error) {
            callback(true, "Unable to fetch data, please try again" + error);
        }
        callback(false, data?.body);
    });
};

module.exports = weatherData;