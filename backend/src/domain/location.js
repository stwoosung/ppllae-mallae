const express = require('express');
const router = express.Router();
const { executeQuery } = require('../db/database'); 
const { fnCallAPINowWeather } = require('../api/apiClient');

router.post('/getListFromGeoLocation', async (req, res) => {
  // 좌표는 절대값이기 때문에 소수점 버림 처리함
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
  console.log(firstValue, secondValue, thirdValue);

  const result = await executeQuery('SELECT x, y FROM location WHERE depth1 = ? AND depth2 = ? AND depth3 = ?;', [ firstValue, secondValue, thirdValue ]);
  fnCallAPINowWeather(result[0].x, result[0].y);
  res.json(null);
});

module.exports = router;