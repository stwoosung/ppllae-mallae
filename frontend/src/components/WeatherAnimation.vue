<template>
  <div id="background" :style="{ backgroundColor: backgroundColor }"></div>
</template>
  
<script>
  export default {
    props: {
      weather: {
        type: String
      },
    },
    data() {
      return {
        backgroundColor: '#1E3A5F', // 기본 배경색
        rainInterval: null, // 비 애니메이션 interval ID
        snowInterval: null, // 눈 애니메이션 interval ID
      };
    },
    mounted() {
      this.setWeather();
    },
    watch: {
      weather: 'setWeather', 
    },
    methods: {
      setWeather() {
        const Weather = {
          SUN: 'SUN',
          CLOUD: 'CLOUD',
          RAIN: 'RAIN',
          SNOW: 'SNOW',
        };
  
        // 기존의 interval 클리어
        if (this.rainInterval) {
          clearInterval(this.rainInterval);
          this.rainInterval = null;
        }
        if (this.snowInterval) {
          clearInterval(this.snowInterval);
          this.snowInterval = null;
        }
  
        switch (this.weather) {
          case Weather.SUN:
            this.backgroundColor = 'lightblue';
            break;
          case Weather.CLOUD:
            this.backgroundColor = 'gray';
            break;
          case Weather.RAIN:
            this.backgroundColor = '#1E3A5F';
            this.createRain();
            break;
          case Weather.SNOW:
            this.backgroundColor = '#0D1B2A';
            this.createSnow();
            break;
        }
      },
      createRain() {
        if (this.rainInterval) clearInterval(this.rainInterval);
        if (this.snowInterval) clearInterval(this.snowInterval);
  
        this.rainInterval = setInterval(() => {
          const rainDrop = document.createElement('div');
          rainDrop.className = 'rain';
          rainDrop.style.left = Math.random() * window.innerWidth + 'px';
          document.getElementById('background').appendChild(rainDrop);
          rainDrop.style.animationDuration = `${1.0 + Math.random() * 1.5}s`;
  
          rainDrop.addEventListener('animationend', () => {
            rainDrop.remove();
          });
        }, 200);
      },
      createSnow() {
        if (this.rainInterval) clearInterval(this.rainInterval);
        if (this.snowInterval) clearInterval(this.snowInterval);
  
        this.snowInterval = setInterval(() => {
          const snowFlake = document.createElement('div');
          snowFlake.className = 'snow';
          snowFlake.style.left = Math.random() * window.innerWidth + 'px';
  
          const size = Math.random() * 10 + 5;
          const opacity = Math.random();
          snowFlake.style.width = size + 'px';
          snowFlake.style.height = size + 'px';
          snowFlake.style.opacity = opacity;
  
          document.getElementById('background').appendChild(snowFlake);
  
          snowFlake.style.animationDuration = `${10 + Math.random() * 5}s`;
          snowFlake.addEventListener('animationend', () => {
            snowFlake.remove();
          });
        }, 500);
      },
    },
  };
  </script>
  
  <style>
  #background {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 0; /* 배경을 카드 아래로 설정 */
  }
  
  .rain {
    position: absolute;
    width: 2px;
    height: 10px;
    background: rgba(255, 255, 255, 0.6);
    animation: fall linear forwards;
  }
  
  .snow {
    position: absolute;
    background: white;
    border-radius: 50%;
    animation: fall linear forwards;
  }
  
  @keyframes fall {
    to {
      transform: translateY(100vh);
    }
  }
</style>
  