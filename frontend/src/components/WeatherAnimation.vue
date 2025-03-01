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
        backgroundColor: '#4682B4', 
        rainInterval: null, 
        snowInterval: null, 
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
            this.backgroundColor = '#4682B4';
            break;
          case Weather.CLOUD:
            this.backgroundColor = '#87CEFA';
            break;
          case Weather.RAIN:
            this.backgroundColor = '#1E3A5F';
            this.fnSetRainAnimation();
            break;
          case Weather.SNOW:
            this.backgroundColor = '#0D1B2A';
            this.fnSetSnowAnimation();
            break;
        }
      },
      fnSetRainAnimation() {
        this.rainInterval = setInterval(() => {
          const rainDrop = document.createElement('div');
          rainDrop.className = 'rain';
          rainDrop.style.left = Math.random() * window.innerWidth + 'px';
          rainDrop.style.top = -10 + 'px'; // 화면 위에서 시작
          document.getElementById('background').appendChild(rainDrop);
          rainDrop.style.animationDuration = `${1.0 + Math.random() * 1.5}s`;

          rainDrop.addEventListener('animationend', () => {
            rainDrop.remove();
          });
        }, 100);
      },
      fnSetSnowAnimation() {
        this.snowInterval = setInterval(() => {
          const snowFlake = document.createElement('div');
          snowFlake.className = 'snow';
          snowFlake.style.left = Math.random() * window.innerWidth + 'px';
          snowFlake.style.top = -10 + 'px'; // 화면 위에서 시작

          const size = Math.random() * 10 + 5;
          const opacity = Math.random();
          snowFlake.style.width = size + 'px';
          snowFlake.style.height = size + 'px';
          snowFlake.style.opacity = opacity;

          document.getElementById('background').appendChild(snowFlake);

          const duration = 10 + Math.random() * 5;
          snowFlake.style.animationDuration = `${duration}s`;
          snowFlake.style.animationName = 'fall';

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
    top: -10px; /* 화면 위쪽에서 시작 */
    background: white;
    border-radius: 50%;
    animation: fall linear forwards;
  }
  
  @keyframes fall {
    to {
      transform: translateY(200vh); /* 화면 아래로 떨어짐 */
    }
  }
</style>
