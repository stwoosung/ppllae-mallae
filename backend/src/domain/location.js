const express = require(`express`);
const router = express.Router();


router.post('/getSecondList', (req, res) => {
    const { firstValue } = req.body; // 요청 본문에서 'test' 키로 값 읽기
    console.log('받은 ID:', firstValue); // 'test'의 값을 콘솔에 출력
  
    // 테스트 데이터 생성
    const testData = [
      { id: 1, name: '항목 1' },
      { id: 2, name: '항목 2' },
      { id: 3, name: '항목 3' },
    ];
  
    // 테스트 데이터 반환
    res.json(testData);
});

module.exports = router;