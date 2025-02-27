<template>
  <v-container>
    <v-row>
      <v-col>
        <canvas ref="scoreChart"></canvas>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default {
  name: 'LineChart',
  props: {
    chartData: {
      type: Array,
      required: true,
    },
  },
  mounted() {
    this.renderChart();
  },
  watch: {
    chartData: {
      handler(newData) {
        this.updateChart(newData);
      },
      deep: true,
    },
  },
  methods: {
    renderChart() {
      this.chart = new Chart(this.$refs.scoreChart.getContext('2d'), {
        type: 'line', 
        data: {
          labels: [],
          datasets: [{
            label: '데이터가 없습니다',
            backgroundColor: 'rgba(66, 165, 245, 0.2)', 
            borderColor: '#42A5F5', 
            borderWidth: 1, 
            data: [],
            fill: false 
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }, 

    updateChart(newData) {
      this.chart.data = newData;
      this.chart.update(); // 차트 업데이트
    }
  }
};
</script>
