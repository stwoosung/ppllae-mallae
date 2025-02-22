<template>
  <v-app>
    <v-container fluid fill-height>
      <v-row justify="center">
        <v-col cols="12" md="6">
          <v-card class="text-center" style="position: relative; z-index: 1;">
            <v-card-title class="pt-10 pb-10" style="font-size: 2em;">현재 지역의 빨래 점수는?</v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="4">
                  <v-select v-model="selected1" :items="items1" label="시 · 도"></v-select>
                </v-col>
                <v-col cols="4">
                  <v-select v-model="selected2" :items="items2" label="시 · 군 · 구"></v-select>
                </v-col>
                <v-col cols="4">
                  <v-select v-model="selected3" :items="items3" label="동 · 면 · 읍"></v-select>
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
    <!--
    <WeatherAnimation :weather="weather" />
    -->
  </v-app>
</template>

<script>
// import WeatherAnimation from '@/components/WeatherAnimation.vue'; 
import { getListFromGeoLocation, getSecondList, getThirdList, getScoreInfo } from '@/api/location';

export default {
  components: {
    // WeatherAnimation,
  }, 
  data() {
    return {
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
      console.log(result);
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
};
</script>

<style>
body {
  font-family: 'PF스타더스트', sans-serif; 
}
</style>