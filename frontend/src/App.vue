<template>
  <v-app>
    <v-container fluid fill-height>
      <v-row justify="center">
        <v-col cols="12" md="6">
          <v-card class="text-center" style="position: relative; z-index: 1;">
            <v-card-title class="pt-10 pb-10">현재 지역의 빨래 점수는?</v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="4">
                  <v-select v-model="selected1" :items="items1" label="시 · 도"></v-select>
                </v-col>
                <v-col cols="12" md="4">
                  <v-select v-model="selected2" :items="items2" label="시 · 군 · 구"></v-select>
                </v-col>
                <v-col cols="12" md="4">
                  <v-select v-model="selected3" :items="items3" label="동 · 면 · 읍"></v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col style="font-size: 1.5em;">
                </v-col>
              </v-row>
              <v-row>
                <v-col style="font-size: 5em;">
                  {{ score }}
                </v-col>
              </v-row>
              <v-row class="pb-15">
                <v-col style="font-size: 1.5em;">
                  {{ message }}
                </v-col>
              </v-row>
              
              <v-data-table-virtual 
                :headers="tableHeaders"
                :items="tableContentsUpdate"
                fixed-header
                height="350"
                class="pb-15"
              ></v-data-table-virtual>
              
              <v-row>
                <v-col cols="12" sm="6" md="6">
                  <chart-component :chartData="chartData[0]"/>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <chart-component :chartData="chartData[1]"/>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="6" md="6">
                  <chart-component :chartData="chartData[2]"/>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <chart-component :chartData="chartData[3]"/>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="6" md="6">
                  <chart-component :chartData="chartData[4]"/>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <chart-component :chartData="chartData[5]"/>
                </v-col>
              </v-row>
            </v-card-text>
            <!--
            <v-card-actions>
              <v-btn @click="toggleWeather">테스트 버튼</v-btn>
            </v-card-actions>
            -->
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <WeatherAnimation :weather="weather" />
    
  </v-app>
</template>

<script>
import WeatherAnimation from '@/components/WeatherAnimation.vue'; 
import ChartComponent from '@/components/ChartComponent.vue';
import { getListFromGeoLocation, getSecondList, getThirdList, getScoreInfo } from '@/api/location';

export default {
  components: {
    WeatherAnimation,
    ChartComponent
  }, 
  data() {
    return {
      
      SKY_DATA_CODE: ['-', '☀️', '-', '🌤️', '☁️'],
      PTY_DATA_CODE: ['-', '☔', '☔❄️', '❄️', '🌂'],
      SNO_DATA_INCLUDES: ['적설없음', '0', ''],

      tableHeaders: [
        { title: '시각', align: 'center', key: 'SEQ' },
        { title: '점수', align: 'center', key: 'SCO' },
        { title: '온도(°C)', align: 'center', key: 'TMP' },
        { title: '날씨', align: 'center', key: 'SKY' },
        { title: '강수', align: 'center', key: 'PTY' },
        { title: '강수확률(%)', align: 'center', key: 'POP' },
        { title: '풍속(m/s)', align: 'center', key: 'WSD' },
        { title: '습도(%)', align: 'center', key: 'REH' },
        { title: '적설(cm)', align: 'center', key: 'SNO' },
      ],
      tableContents: [{}],

      selected1: null,
      selected2: null,
      selected3: null,

      items1: ['강원특별자치도', '경기도', '경상남도', '경상북도', '광주광역시', '대구광역시', '대전광역시', '부산광역시', '서울특별시', '세종특별자치시', '울산광역시', '이어도', '인천광역시', '전라남도', '전북특별자치도', '제주특별자치도', '충청남도', '충청북도'], 
      items2: [], 
      items3: [], 

      locDepth1: null, 
      locDepth2: null, 
      locDepth3: null, 
      
      weather: 'SUN', // 기본 날씨 설정
      score: '🤔', 
      message: '지역을 입력해 주세요!', 

      chartData: []
    };
  },
  mounted() {
    this.getLocation();
  },
  watch: {

    async selected1(value) {
      this.items2 = this.items3 = [];
      this.selected2 = this.selected3 = null;
      let result = await getSecondList( { 'firstValue': value } );
      this.items2 = result.data.map(item => item.depth2);
      if (this.locDepth1 !== null) {
        this.selected2 = this.locDepth2;
        this.locDepth1 = null;
      }
    }, 

    async selected2(value) {
      this.items3 = [];
      this.selected3 = null;
      let result = await getThirdList( { 'firstValue': this.selected1, 'secondValue': value } );
      this.items3 = result.data.map(item => item.depth3); 
      if (this.locDepth2 !== null) {
        this.selected3 = this.locDepth3;
        this.locDepth2 = this.locDepth3 = null;
      }
    }, 

    async selected3(value) {
      if (value === null) return;
      
      let result = await getScoreInfo( { 'firstValue': this.selected1, 'secondValue': this.selected2, 'thirdValue': value } );
      if (result.data === null) return;
      
      this.chartData[0] = result.data[2].SCO;
      this.chartData[1] = result.data[2].TMP;
      this.chartData[2] = result.data[2].POP;
      this.chartData[3] = result.data[2].WSD;
      this.chartData[4] = result.data[2].REH;
      this.chartData[5] = result.data[2].SNO;


      this.tableContents = result.data[0];
      
      if (result.data[1] >= 80) {
        this.score = "😊 " + result.data[1] + "점"
        this.message = "빨래하기 딱 좋은 날이에요!"
      } else if (result.data[1] >= 60) {
        this.score = "😙 " + result.data[1] + "점"
        this.message = "빨래하기 괜찮은 날이에요!"
      } else if (result.data[1] >= 50) {
        this.score = "🤔 " + result.data[1] + "점"
        this.message = "빨래하기 나쁘지 않아요!"
      } else if (result.data[1] >= 40) {
        this.score = "😥 " + result.data[1] + "점"
        this.message = "다른 날을 추천해요!"
      } else {
        this.score = "😨 " + result.data[1] + "점"
        this.message = "오늘은 절대 안돼요!"
      }
    }
  }, 
  methods: {
    async getLocation() {
      window.navigator.geolocation.getCurrentPosition(async (position) => {
        let result = await getListFromGeoLocation({ 'x': position.coords.longitude, 'y': position.coords.latitude });
        this.locDepth1 = result.data.depth1; 
        this.locDepth2 = result.data.depth2; 
        this.locDepth3 = result.data.depth3; 
        this.selected1 = this.locDepth1; 
      });
    },
    toggleWeather() {
      this.weather = this.weather === 'RAIN' ? 'SNOW' : 'RAIN';
    },
  },
  computed: {
    tableContentsUpdate() {

      return [...Array(this.tableContents.length).keys()].map(i => {
        const row = { ...this.tableContents[i % this.tableContents.length] };
        row.SKY = this.SKY_DATA_CODE[row.SKY];
        row.PTY = this.PTY_DATA_CODE[row.PTY];
        row.SNO = this.SNO_DATA_INCLUDES.includes(row.SNO) ? '-' : row.SNO;
        return row;
      })
    }
  }
};
</script>



<style>

body {
  font-family: 'PF스타더스트'; 
}

@font-face {
  font-family: 'PF스타더스트';
  src: url('./assets/PF스타더스트.woff') format('woff');
}

.v-card-title {
    font-size: 2em; /* 기본 폰트 사이즈 */
}

@media (max-width: 600px) {
    .v-card-title {
        font-size: 1.5em; /* 모바일에서의 폰트 사이즈 */
    }
}
</style>
