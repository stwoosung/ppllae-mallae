const request = require('request');

const API_KEY = 'vaCGRWEJi1IDLqkGtUiw9f4wlA0DUiCtLfzGLK8kkIpSXVBDkKjIWZ3OcOD2lYv9ULRwnQcV0JtXIScmuvB6jg==' // process.env.API_KEY;

// API 호출 URL
const API_NOW_WEATHER = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?serviceKey=${ API_KEY }&numOfRows=100&pageNo=1&type=json&pageNo=1&numOfRows=1000&dataType=XML&base_date=20250221&base_time=0600&nx=55&ny=127`;




const fnCallAPINowWeather = (x, y) => {
    request(encodeURI(API_NOW_WEATHER), async function (err, res, body) {
        if (err != null) {
            console.log(err);
            return;
        }
        const result = JSON.parse(body).response.body.items;

        console.log(result);
    });
}

module.exports = { 
    fnCallAPINowWeather
}