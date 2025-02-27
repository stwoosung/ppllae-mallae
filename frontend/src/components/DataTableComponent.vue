<template>
    <v-data-table-virtual 
      :headers="tableHeaders"
      :items="processedItems"
      fixed-header
      height="350"
      class="pb-15"
    ></v-data-table-virtual>
  </template>
  
  <script>
  export default {
    props: {
      items: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
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
        SKY_DATA_CODE: ['-', '☀️', '-', '🌤️', '☁️'],
        PTY_DATA_CODE: ['-', '☔', '☔❄️', '❄️', '🌂'],
        SNO_DATA_INCLUDES: ['적설없음', '0', '']
      };
    },
    computed: {
      processedItems() {
        return this.items.map(item => {
          const row = { ...item };
          row.SKY = this.SKY_DATA_CODE[row.SKY];
          row.PTY = this.PTY_DATA_CODE[row.PTY];
          row.SNO = this.SNO_DATA_INCLUDES.includes(row.SNO) ? '-' : row.SNO;
          return row;
        });
      }
    }
  };
  </script>