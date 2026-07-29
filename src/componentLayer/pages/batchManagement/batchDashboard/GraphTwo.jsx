import React from 'react'
import ReactApexChart from "react-apexcharts";
import { useState } from "react";
const GraphTwo = () => {
  const [chartData, setChartData] = useState({
    series: [
      {
        name: 'Active Batches',
        data: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60]
      },
      {
        name: 'Students',
        data: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60]
      }
    ],
    options: {
      chart: {
        height: 350,
        type: 'bar',
        stacked: true,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '15%',
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: [
          'pavan', 'sasi', 'krishna', 'bala', 'abhi', 'priya', 'mouni', 'anu', 'sri', 'shobha', 'ammu', 'ricky'
        ],
      },
      yaxis: {
        title: {

        }
      },
      fill: {
        opacity: 1
      },
      colors: ['#405189', '#A9A9A9'],
      title: {

        align: 'left',
      },
      tooltip: {
        shared: true,
        intersect: false,
      },
    },
  });

  return (
    <div>
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="bar"
        height={405}
      />
    </div>
  )
}

export default GraphTwo