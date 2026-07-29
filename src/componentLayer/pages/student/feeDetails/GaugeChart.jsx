import React from 'react';
import ReactEcharts from "echarts-for-react";

const GaugeChart = ({ studentData }) => {



  const extraTotalDiscount = studentData && studentData?.extra_discount?.length > 0 ? studentData?.extra_discount?.reduce((index, item) => {
    return index + (item?.Discount || 0);
  }, 0) : 0;


  const TotalAmount = studentData && studentData?.finaltotal;
  const paidamount = studentData && studentData?.totalpaidamount;
  const dueamount = studentData && studentData?.dueamount;
  const FinalTotalAmount = TotalAmount - extraTotalDiscount;
  const percentage = (paidamount / FinalTotalAmount) * 100;
  const staticValue = percentage?.toFixed(0);


  var option = {
    color: ["#405189"],
    textStyle: {
      fontFamily: "Poppins, sans-serif",
    },
    series: [
      {
        name: "Pressure",
        type: "gauge",
        progress: {
          show: true,
        },
        detail: {
          valueAnimation: true,
          formatter: "{value}",
          color: "#858d98",
        },
        axisLabel: {
          color: "#858d98",
        },
        data: [
          {
            title: {
              color: "#858d98",
            },
            value: staticValue,
            name: "Percentage",
          },
        ],
        axisLine: {
          lineStyle: {
            width: 12,
            shadowColor: "#fff",
            shadowBlur: 15,
            shadowOffsetX: 2,
            shadowOffsetY: 2,
          },
        },
        splitLine: {
          length: 25,
          lineStyle: {
            color: "auto",
          },
        },
        pointer: {
          itemStyle: {
            color: "#e96228",
          },
        },
      },
    ],
  };


  return (

    <div className="col-lg-5">
      <div className="card border-0">
        <div className="card-header">
          <div className="d-flex justify-content-center mt-1">
            <React.Fragment>
              <ReactEcharts
                style={{ width: "400px", height: "480px" }}
                option={option}
              />
            </React.Fragment>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GaugeChart;
