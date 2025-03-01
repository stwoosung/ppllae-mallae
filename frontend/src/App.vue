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

              <v-overlay v-model="overlay" class="justify-center" contained>
                <v-progress-circular indeterminate color="blue" style="margin-top: 30em;"/>
              </v-overlay>
              
              <DataTableComponent :items="dataTableContents"/>
              
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
import DataTableComponent from '@/components/DataTableComponent.vue';
import { getListFromGeoLocation, getSecondList, getThirdList, getScoreInfo } from '@/api/location';

export default {
  components: {
    WeatherAnimation,
    ChartComponent, 
    DataTableComponent
  }, 
  data() {
    return {
      overlay: false, 
      
      selected1: null,
      selected2: null,
      selected3: null,
      
      locDepth1: null, 
      locDepth2: null, 
      locDepth3: null, 
      
      items1: ['강원특별자치도', '경기도', '경상남도', '경상북도', '광주광역시', '대구광역시', '대전광역시', '부산광역시', '서울특별시', '세종특별자치시', '울산광역시', '이어도', '인천광역시', '전라남도', '전북특별자치도', '제주특별자치도', '충청남도', '충청북도'], 
      items2: [], 
      items3: [], 
      
      dataTableContents: [{}],
      chartData: [], 
      
      weather: 'SUN', // 기본 날씨 설정
      score: '🤔', 
      message: '지역을 입력해 주세요!', 
    };
  },
  mounted() {
    this.fnGetLocation();
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
      
      this.overlay = true;
      let result = await getScoreInfo( { 'firstValue': this.selected1, 'secondValue': this.selected2, 'thirdValue': value } );
      this.overlay = false;
      
      
      if (result.data === null) {
        return;
      }

      let color = '#4682B4';
      if (result.data[0][0].SKY === 1) {
        this.weather = "SUN";
        color = '#4682B4';
      }
      else if (result.data[0][0].SKY === 3) { 
        this.weather = "CLOUD";
        color = '#87CEFA';
      }
      else if (result.data[0][0].SKY === 4 && (result.data[0][0].PTY === 1 || result.data[0][0].PTY === 4)) {
        this.weather = "RAIN";
        color = '#1E3A5F';
      }
      else if (result.data[0][0].SKY === 4 && (result.data[0][0].PTY === 2 || result.data[0][0].PTY === 3)) {
        this.weather = "SNOW";
        color = '#0D1B2A';
      }

      console.log(color)
      Object.keys(result.data[2]).forEach(key => {
        result.data[2][key].datasets[0].backgroundColor = color;
        result.data[2][key].datasets[0].borderColor = color;
      });

      this.chartData[0] = result.data[2].SCO;
      this.chartData[1] = result.data[2].TMP;
      this.chartData[2] = result.data[2].POP;
      this.chartData[3] = result.data[2].WSD;
      this.chartData[4] = result.data[2].REH;
      this.chartData[5] = result.data[2].SNO;
      
      console.log(this.chartData[0]);

      this.dataTableContents = result.data[0];
      
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
    async fnGetLocation() {
      window.navigator.geolocation.getCurrentPosition(async (position) => {
        let result = await getListFromGeoLocation({ 'x': position.coords.longitude, 'y': position.coords.latitude });
        this.locDepth1 = result.data.depth1; 
        this.locDepth2 = result.data.depth2; 
        this.locDepth3 = result.data.depth3; 
        this.selected1 = this.locDepth1; 
      });
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
