const fnGetAPINowWeatherURL = (API_KEY, stringType, date, hour, x, y) => { return `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${ API_KEY }&numOfRows=1000&dataType=${ stringType }&base_date=${ date }&base_time=${ hour }&nx=${ x }&ny=${ y }`; }
const fnGetDateFormat = (date) => { return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`; }
const fnGetHourFormat = (date) => { return `${String(date.getHours()).padStart(2, '0')}00`; }
const fnGetDateKey = (str) => `${str.slice(4, 6)}/${str.slice(6, 8)} ${str.slice(9, 11)}시`;
const fnIsNumber = (val) => { return !isNaN(val) ? val : 0 };
const fnGetChartFormat = (label) => {
    return {
      labels: [],
      datasets: [{
        label: label,
        borderWidth: 1, 
        data: [],
        fill: false 
      }]
    } 
  };

module.exports = {
    fnGetAPINowWeatherURL, 
    fnGetDateFormat, 
    fnGetHourFormat, 
    fnGetDateKey, 
    fnIsNumber, 
    fnGetChartFormat
}