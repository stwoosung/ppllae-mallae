const express = require('express');
const router = express.Router();
const { executeQuery } = require('../db/database'); 
const { fnCallAPINowWeather } = require('../api/apiClient');

router.post('/getListFromGeoLocation', async (req, res) => {
  // 좌표는 절대값이기 때문에 소수점 버림 처리함
  // sqlite3 기능에 소수점 자리 지정해서 버림 기능이 없어서
  // 문자열 변환 후 버림 처리함
  const { x, y } = req.body; 
  const result = await executeQuery('SELECT * FROM location WHERE SUBSTR(CAST(mx AS TEXT), 1, 6) = SUBSTR(CAST(? AS TEXT), 1, 6) AND SUBSTR(CAST(my AS TEXT), 1, 5) = SUBSTR(CAST(? AS TEXT), 1, 5) LIMIT 1;', [ x, y ]);
  res.json(result[0]);
});

router.post('/getSecondList', async (req, res) => {
  const { firstValue } = req.body; 
  const result = await executeQuery('SELECT DISTINCT depth2 FROM location WHERE depth1 = ?;', [ firstValue ]);
  res.json(result);
});

router.post('/getThirdList', async (req, res) => {
  const { firstValue, secondValue } = req.body; 
  const result = await executeQuery('SELECT DISTINCT depth3 FROM location WHERE depth1 = ? AND depth2 = ?;', [ firstValue, secondValue ]);
  res.json(result);
});

const fnFormatDate = (str) => `${str.slice(4, 6)}/${str.slice(6, 8)} ${str.slice(9, 11)}시`;
const fnIsNumber = (val) => { return !isNaN(val) ? val : 0 };
const fnGetChartFormat = (label) => {
  return {
    labels: [],
    datasets: [{
      label: label,
      backgroundColor: 'rgba(66, 165, 245, 0.2)', 
      borderColor: '#42A5F5', 
      borderWidth: 1, 
      data: [],
      fill: false 
    }]
  } 
};


router.post('/getScoreInfo', async (req, res) => {
  const { firstValue, secondValue, thirdValue } = req.body;
  
  // 위치정보 갱신이 느릴 때 undifined 넘어오는 경우, 예외처리 함
  if (firstValue === undefined ||  secondValue === undefined || thirdValue === undefined) {
    res.json(null);
    return;
  }

  const location = await executeQuery('SELECT x, y FROM location WHERE depth1 = ? AND depth2 = ? AND depth3 = ?;', [ firstValue, secondValue, thirdValue ]);
  const result = await fnCallAPINowWeather(location[0].x, location[0].y);

  if (result === null || result === undefined) {
    res.json(null);
    return;
  }
  
  const dataTable = [];  
  let totalScore = null; 

  result.item.forEach(row => {

    // 날짜 + 시간으로 Key 설정
    const timeKey = `${row.fcstDate}-${row.fcstTime}`;
    const existingEntry = dataTable.find(entry => entry.time === timeKey);

    if (existingEntry) {
      if (row.category === 'TMP') existingEntry.TMP = row.fcstValue;
      else if (row.category === 'WSD') existingEntry.WSD = row.fcstValue; 
      else if (row.category === 'SKY') existingEntry.SKY = row.fcstValue; 
      else if (row.category === 'PTY') existingEntry.PTY = row.fcstValue; 
      else if (row.category === 'POP') existingEntry.POP = row.fcstValue; 
      else if (row.category === 'REH') existingEntry.REH = row.fcstValue;  
      else if (row.category === 'SNO') existingEntry.SNO = row.fcstValue; 
      
    } else {
      dataTable.push({
        time: timeKey,
        SEQ: fnFormatDate(timeKey), 
        SCO: null, 
        TMP: row.category === 'TMP' ? row.fcstValue : null,
        WSD: row.category === 'WSD' ? row.fcstValue : null, 
        SKY: row.category === 'SKY' ? row.fcstValue : null,
        PTY: row.category === 'PTY' ? row.fcstValue : null,
        POP: row.category === 'POP' ? row.fcstValue : null,
        REH: row.category === 'REH' ? row.fcstValue : null, 
        SNO: row.category === 'SNO' ? row.fcstValue : null, 
      }); 
    }
  });

  const chart = { 
    SCO: fnGetChartFormat('빨래 점수'),
    TMP: fnGetChartFormat('온도(°C)'), 
    POP: fnGetChartFormat('강수확률(%)'),
    WSD: fnGetChartFormat('풍속(m/s)'),
    REH: fnGetChartFormat('습도(%)'),
    SNO: fnGetChartFormat('적설(cm)')
  };

  dataTable.forEach(row => {
    let score = 0;
    
    // 온도
    if (row.TMP < 0) score -= 10;
    else if (row.TMP > 5 && row.TMP <= 10) score += 10;
    else if (row.TMP <= 20) score += 20;
    else if (row.TMP <= 30) score += 30;
    else score += 10;

    // 풍속
    if (row.WSD > 0 && row.WSD < 1) score += 10;
    else if (row.WSD >= 1 && row.WSD <= 5) score += 20;

    // 습도
    if (row.REH < 30) score += 20;
    else if (row.REH <= 60) score += 10;
    else score -= 10;

    // 날씨
    if (row.SKY == 1) score += 40;
    else if (row.SKY == 3 || row.SKY == 4) score += 20;
    if (row.PTY == 1 || row.PTY == 2 || row.PTY == 3 || row.PTY == 4) score -= 40;

    row.SCO = Math.max(0, Math.min(100, score));
    totalScore += score


    // 차트 생성
    chart.SCO.labels.push(row.SEQ);
    chart.SCO.datasets[0].data.push(fnIsNumber(row.SCO));
    chart.TMP.labels.push(row.SEQ);
    chart.TMP.datasets[0].data.push(fnIsNumber(row.TMP));
    chart.POP.labels.push(row.SEQ);
    chart.POP.datasets[0].data.push(fnIsNumber(row.POP));
    chart.WSD.labels.push(row.SEQ);
    chart.WSD.datasets[0].data.push(fnIsNumber(row.WSD));
    chart.REH.labels.push(row.SEQ);
    chart.REH.datasets[0].data.push(fnIsNumber(row.REH));
    chart.SNO.labels.push(row.SEQ);
    chart.SNO.datasets[0].data.push(fnIsNumber(row.SNO));
  });
  res.json([ dataTable, Math.floor(totalScore / dataTable.length), chart ]);
});

module.exports = router;