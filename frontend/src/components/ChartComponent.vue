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
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
          datasets: [{
            label: '빨래 점수',
            backgroundColor: 'rgba(66, 165, 245, 0.2)', 
            borderColor: '#42A5F5', 
            borderWidth: 1, 
            data: [40, 20, 12, 39, 10, 40, 39],
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
      // console.log(newData);
      // console.log(this.chart);
      this.chart.data.datasets[0].data = newData;
      this.chart.update(); // 차트 업데이트
    }
  }
};
</script>
