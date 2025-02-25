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

router.post('/getScoreInfo', async (req, res) => {
  const { firstValue, secondValue, thirdValue } = req.body;
  
  // 위치정보 갱신이 느릴 때 undifined 넘어오는 경우, 예외처리 함
  if (firstValue === undefined ||  secondValue === undefined || thirdValue === undefined) {
    res.json(null);
  }
  
  const location = await executeQuery('SELECT x, y FROM location WHERE depth1 = ? AND depth2 = ? AND depth3 = ?;', [ firstValue, secondValue, thirdValue ]);
  const result = await fnCallAPINowWeather(location[0].x, location[0].y);
  
  console.log(result)

  

  res.json(null);
});

module.exports = router;