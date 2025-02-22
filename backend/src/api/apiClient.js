const axios = require('axios');

const API_KEY = process.env.API_KEY 

const fnGetAPINowWeatherURL = (stringType, date, hour, x, y) => { return `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?serviceKey=${ API_KEY }&numOfRows=100&pageNo=1&type=json&pageNo=1&numOfRows=1000&dataType=${ stringType }&base_date=${ date }&base_time=${ hour }&nx=${ x }&ny=${ y }`; }
const fnGetDateFormat = (date) => { return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`; }
const fnGetHourFormat = (date) => { return `${String(date.getHours()).padStart(2, '0')}00`; }

const fnCallAPINowWeather = async (x, y) => {
    try {
        let date = new Date();
        console.log(fnGetAPINowWeatherURL('JSON', fnGetDateFormat(date), fnGetHourFormat(date), x, y));
        let result = await axios.get(fnGetAPINowWeatherURL('JSON', fnGetDateFormat(date), fnGetHourFormat(date), x, y)); 

        // 정각 업데이트가 아직 이루어지지 않았을 때
        // 한시간 전 API 결과를 호출한다.
        if (result.data.response.header.resultCode === "03") {
            date.setHours(date.getHours() - 1);
            result = await axios.get(fnGetAPINowWeatherURL('JSON', fnGetDateFormat(date), fnGetHourFormat(date), x, y));
        } 

        // API 결과 정상일 때만 return
        return result.data.response.header.resultCode === "00" ? result.data.response.body.items : null;

    } catch (error) {
        console.log(error);
    }
}

module.exports = { 
    fnCallAPINowWeather
}