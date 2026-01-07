"use strict";

// const { async } = require("rxjs");

var getData = async (site) => {
  const res = await fetch('/smia-ostie/stats/week?site=' + site);
  const data = await res.json();
  console.log("GET DATA:", data);
  return data;
}
var randomChartData = function randomChartData(n) {
  var data = [];

  for (var i = 0; i < n; i++) {
    const nb = Math.random();
    // console.log("RANDOM:", nb);
    
    data.push(Math.round(nb * 10));
  }
  data.push(0)
  console.log("DATA:", data);
  return data;
};

var chartColors = {
  "default": {
    primary: '#110a55ff',
    info: '#209CEE',
    danger: '#FF3860'
  }
};
var ctx = document.getElementById('big-line-chart').getContext('2d');
async function initChart() {
  const dataRABE = await getData('RABE');
  const dataLAG = await getData('LAG');
  const dataTANA = await getData('TANA');
  new Chart(ctx, {
    type: 'bar',
    data: {
      datasets: [{
      fill: false,
      borderColor: chartColors["default"].primary,
      borderWidth: 2,
      borderDash: [],
      borderDashOffset: 0.0,
      pointBackgroundColor: chartColors["default"].primary,
      pointBorderColor: 'rgba(255,255,255,0)',
      pointHoverBackgroundColor: chartColors["default"].primary,
      pointBorderWidth: 20,
      pointHoverRadius: 4,
      pointHoverBorderWidth: 15,
      pointRadius: 4,
      // data: randomChartData(7)
      data: dataRABE
      // data: [1, 2, 3, 4, 5, 6, 0]
    }, {
      fill: false,
      borderColor: chartColors["default"].info,
      borderWidth: 2,
      borderDash: [],
      borderDashOffset: 0.0,
      pointBackgroundColor: chartColors["default"].info,
      pointBorderColor: 'rgba(255,255,255,0)',
      pointHoverBackgroundColor: chartColors["default"].info,
      pointBorderWidth: 20,
      pointHoverRadius: 4,
      pointHoverBorderWidth: 15,
      pointRadius: 4,
      // data: randomChartData(7)
      data: dataLAG
    }, {
      fill: false,
      borderColor: chartColors["default"].danger,
      borderWidth: 2,
      borderDash: [],
      borderDashOffset: 0.0,
      pointBackgroundColor: chartColors["default"].danger,
      pointBorderColor: 'rgba(255,255,255,0)',
      pointHoverBackgroundColor: chartColors["default"].danger,
      pointBorderWidth: 20,
      pointHoverRadius: 4,
      pointHoverBorderWidth: 15,
      pointRadius: 4,
      data: dataTANA
    }],
    labels: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche', '']
  },
  options: {
    maintainAspectRatio: false,
    legend: {
      display: false
    },
    responsive: true,
    tooltips: {
      backgroundColor: '#f5f5f5',
      titleFontColor: '#333',
      bodyFontColor: '#666',
      bodySpacing: 4,
      xPadding: 13,
      mode: 'nearest',
      intersect: 0,
      position: 'nearest'
    },
    scales: {
      yAxes: [{
        barPercentage: 1.6,
        gridLines: {
          drawBorder: false,
          color: 'rgba(29,140,248,0.0)',
          zeroLineColor: 'transparent'
        },
        ticks: {
          padding: 20,
          fontColor: '#9a9a9a'
        }
      }],
      xAxes: [{
        barPercentage: 0.1,
        gridLines: {
          drawBorder: false,
          color: 'rgba(225,78,202,0.1)',
          zeroLineColor: 'transparent'
        },
        ticks: {
          padding: 20,
          fontColor: '#9a9a9a'
        }
      }]
    }
  }
});
}
initChart();