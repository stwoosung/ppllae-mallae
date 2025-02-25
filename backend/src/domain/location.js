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
  const SKY_DATA_CODE = ['-', '\u{1F505}', '-', '\u{26C5}', '\u{2601}']
  const PTY_DATA_CODE = ['-', '\u{2614}', '\u{2614}\u{2744}', '\u{2744}', '\u{1F302}']
  const SNO_DATA_INCLUDES = ['적설없음', '0', '']

  let nowWeather = null; 
  let nowTemp = null;

  result.item.forEach(row => {

    // 날짜 + 시간으로 Key 설정
    const timeKey = `${row.fcstDate}-${row.fcstTime}`;
    const existingEntry = dataTable.find(entry => entry.time === timeKey);

    if (existingEntry) {
      if (row.category === 'TMP') { 
        existingEntry.TMP = row.fcstValue;
      } else if (row.category === 'WSD') {
        existingEntry.WSD = row.fcstValue; 
      } else if (row.category === 'SKY') {
        
        console.log(dataTable.length);
        existingEntry.SKY = SKY_DATA_CODE[row.fcstValue]; 
      } else if (row.category === 'PTY') {
        existingEntry.PTY = PTY_DATA_CODE[row.fcstValue]; 
      } else if (row.category === 'POP') {
        existingEntry.POP = row.fcstValue; 
      } else if (row.category === 'REH') {
        existingEntry.REH = row.fcstValue;  
      } else if (row.category === 'SNO') {
        existingEntry.SNO = SNO_DATA_INCLUDES.includes(row.fcstValue) ? "-" : row.fcstValue; 
      }
      
    } else {
      dataTable.push({
        time: timeKey,
        SEQ: fnFormatDate(timeKey), 
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
  console.log(dataTable[0]);

  res.json([ dataTable ]);
});

module.exports = router;