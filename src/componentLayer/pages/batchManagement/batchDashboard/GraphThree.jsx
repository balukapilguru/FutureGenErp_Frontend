import { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { ERPApi } from "../../../../serviceLayer/interceptor.jsx";
import Select from "react-select";

import { MdOutlineWbSunny } from "react-icons/md";
import { IoMoonOutline } from "react-icons/io5";
import { AiOutlineRollback } from "react-icons/ai";
import { closeLoadingPopup, showLoadingPopup } from "../../../../utils/LoadingPopUpSwal.jsx";

const GraphThree = () => {


  const [userData, setUserData] = useState(() => {
    const data = JSON.parse(localStorage.getItem("data"));
    return data || "";
  });
console.log("data")
  const [curriculumList, setCurriculumList] = useState([]);
  const [filters, setFilters] = useState({
    curriculum: "",
  });







  const [queryBatchesSearch, setQueryBatchesSearch] = useState({
    curriculum: "",
  });

  const fetchCurriculumList = async (value) => {

    try {
      const { data, status } = await ERPApi.get(`/batch/curriculum/filter?search=${value}`);
      if (status === 200) {
        const curriculumList = data?.map((item) => ({
          label: item.curriculumName,
          value: item.id,
        }));
        setCurriculumList((prev) => ({
          ...prev,
          curriculumList
        }))
      }
    } catch (error) {
      console.error(error)
    }
  };

  const handleQuerySearch = (value) => {
    setQueryBatchesSearch({ ...queryBatchesSearch, curriculum: value });
  }
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchCurriculumList(queryBatchesSearch?.curriculum);
    }, 500);
    return () => clearTimeout(handler)
  }, [queryBatchesSearch?.curriculum]);





  //  Today Actiive Batches

  const [todayActiveBatchesChart, setTodayActiveBatchesChart] = useState({
    series: [
      {
        name: "Today Active Batches",
        data: [],
      }
    ],
    options: {
      // chart: {
      //   type: "bar",
      //   height: 1850,
      //   toolbar: { show: false },
      //   events: {
      //     click: async (event, chartContext, config) => {
      //       const clickedIndex = config.dataPointIndex;
      //       if (clickedIndex !== -1) {
      //         const clickedBranch = BranchesListData[clickedIndex];
      //         const branchId = clickedBranch.id;
      //         setBranch((prev) => ({
      //           ...prev,
      //           branchId: branchId,
      //         }))
      //       }
      //     },
      //   }
      // },
      plotOptions: {
        bar: {
          horizontal: false,
          barHeight: "100%",
          dataLabels: {
            position: "top",
          },
        },

      },
      dataLabels: {
        enabled: true,
        offsetX: 0,
        offsetY: -8,
        style: {
          fontSize: "6px",
          colors: ["#fff"],
        },
      },
      stroke: {
        show: true,
        width: 1,
        colors: ["#fff"],
      },
      tooltip: {
        shared: true,
        intersect: false,
      },
      xaxis: {
        categories: [],
      },
      yaxis: {
        labels: {
          style: {
            fontSize: "16px",
          },
        },
      },
      legend: {
        fontSize: "12px",
      },
      colors: ["#e96228", "#405189"],
    },
  });





  const FetchTodayActiveBatchesAndBranchesList = async () => {
    try {
      const [BranchesList, TodayActiveBatches] = await Promise.all([
        ERPApi.get(`/settings/getbranch`),
        ERPApi.get(`/batch/dashboard/batchcount`)
      ]);

      if (BranchesList?.status === 200 && TodayActiveBatches?.status === 200) {
        const Branches = BranchesList?.data?.branchData;
        const BranchData = TodayActiveBatches?.data?.result;

        if (Branches && Array.isArray(Branches)) {
          const branchNamesFromState = Branches?.map((item) => ({
            branch: {
              id: item.id,
              name: item?.branch_name.trim().toLowerCase()
            }
          }));

          const activeBatches = Array(branchNamesFromState.length).fill(0);
          if (Array.isArray(BranchData) && BranchData.length > 0) {
            BranchData?.forEach((branch) => {
              const branchIdFromAPI = branch?.id;
              const branchIndex = branchNamesFromState.findIndex((item) => item.branch.id === branchIdFromAPI);
              if (branchIndex !== -1) {
                activeBatches[branchIndex] = branch?.activeBatchCount;
              }
            });

            setTodayActiveBatchesChart((prevChart) => ({
              ...prevChart,
              series: [
                {
                  name: "Today Active Batches",
                  data: BranchData.length === 0 ? [] : activeBatches,
                }
              ],
              options: {
                ...prevChart.options,
                xaxis: {
                  categories: branchNamesFromState.map(
                    (item) => item?.branch?.name.replace(/\s/g, '').charAt(0).toUpperCase() + item?.branch?.name.replace(/\s/g, '').slice(1)
                  ),
                },
                chart: {
                  type: "bar",
                  height: 1850,
                  toolbar: { show: false },
                  events: {
                    click: async (event, chartContext, config) => {
                      const clickedIndex = config.dataPointIndex;
                      if (clickedIndex !== -1) {
                        const clickedBranch = Branches[clickedIndex];
                        const switchBranch = activeBatches[clickedIndex] === 0 ? false : true;

                        const branchId = clickedBranch.id;
                        setBranch((prev) => ({
                          ...prev,
                          branchId: switchBranch === true ? branchId : null,
                        }))
                      }
                    },
                  }
                }
              },
            }));
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  }


  useEffect(() => {
    if (userData?.user?.profile === "Admin" ||
      userData?.user?.profile === "Support" ||
      userData?.user?.profile === "Regional Manager") {
      FetchTodayActiveBatchesAndBranchesList();
    }
    if (userData?.user?.profile === "Branch Manager") {
      const branchId = userData?.user?.branchId;
      setBranch((prev) => ({
        ...prev,
        branchId: branchId,
      }))
    }
    fetchCurriculumList();
  }, []);



  //   Branch Wise Batches - Trainers

  const formatTimeRange = (startTime, endTime) => {
    // Helper function to convert minutes to 12-hour time format
    const minutesToTime = (minutes) => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      const period = hours >= 12 ? "PM" : "AM";
      const formattedHours = hours % 12 || 12; // Convert to 12-hour format, 0 becomes 12
      const formattedMinutes = mins.toString().padStart(2, "0"); // Pad minutes to 2 digits
      return `${formattedHours}:${formattedMinutes} ${period}`;
    };

    // Convert startTime and endTime
    const start = minutesToTime(startTime);
    const end = minutesToTime(endTime);

    // Return the formatted time range
    return `${start} - ${end}`;
  }

  const timeToMinutes = (time) => {
    if (time) {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    }
  };

  const getColor = (percent) => {
    if (percent === 0) return "#07bc0c";
    if (percent >= 1 && percent <= 9) return "#8e8c8c";
    if (percent >= 10 && percent <= 49) return "#f1c40f";
    if (percent >= 50 && percent <= 89) return "#eb6329";
    if (percent >= 90 && percent <= 100) return "#da3412";
  };
  const [branch, setBranch] = useState({
    branchId: null,
  });


  const [time, setTime] = useState({
    isAM: false,
  });


  const handletoggleTimeChage = (value) => {
    setTime((prev) => ({
      ...prev,
      isAM: value,
    }));
    setTrainerBatchChart((prev) => ({
      ...prev,
      options: {
        ...prev.options,
        xaxis: {
          ...prev.options.xaxis,
          min: value ? 0 : 720,
          max: value ? 720 : 1440 // Ensure y-axis categories are updated dynamically
        },
      },
    }));
  }



  const [Loading, setLoading] = useState({
    trinerWiseBatches: false,
  })


  const fetchChartDataFromAnotherSource = async (branchId, curriculumId) => {

    if (branchId) {
      setLoading((prev) => ({
        ...prev,
        trinerWiseBatches: true,
      }));

      try {
        const { data, status } = await ERPApi.get(`/batch/dashboard/trainersinfo?curriculumId=${curriculumId ? curriculumId : null}&branchId=${branchId}`)

        if (status === 200) {

          const trainersSeriesData = data.map((trainer) => {
            return {
              name: trainer.fullname,
              data: trainer.batches.map((batch) => ({
                x: trainer.fullname,
                y: [timeToMinutes(batch.startTime), timeToMinutes(batch.endTime)],
                fillColor: getColor(((batch?.copyCurriculum?.completedModuleCount / batch?.copyCurriculum
                  .totalModuleCount) * 100)),
              })),
            }
          });


          const colorsSeries = trainersSeriesData?.flatMap((trainer) =>
            trainer?.data?.map((dataPoint) => dataPoint?.fillColor)
          );

          const categoiresdata = data?.map((item) => item.batches.length !== 0);
          const some = categoiresdata.reduce((item) => item === true) ? data?.map((trainer) => trainer?.fullname) : ["No Trainers Avalibal"];


          setTrainerBatchChart((prev) => ({
            ...prev,
            series: trainersSeriesData,
            options: {
              ...prev.options,
              colors: colorsSeries,
              yaxis: {
                ...prev.options.yaxis,
                categories: some,
              },
              tooltip: {
                enabled: true,
                shared: false,
                custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                  const trainer = w.globals.seriesNames[seriesIndex];
                  const batchData = w.config.series[seriesIndex].data[dataPointIndex]; // Data point details

                  const duration = batchData.y[1] - batchData.y[0]

                  return `
                    <div style="padding: 8px; background: white; border: 0.5px solid #ccc; ">
                      <span className="fs-13 lh-xs  fw-600"> <strong>Trainer :</strong> ${trainer}<br/></span>
                     <span className="fs-13 lh-xs  fw-600"> <strong>Timings :</strong> ${formatTimeRange(batchData.y[0], batchData.y[1])}<br/></span>
                     <span className="fs-13 lh-xs  fw-600"> <strong>Duration :</strong> ${duration} Minutes <br/></span>
                    </div>
                  `;
                },
              },
            },
          }));

        }
      }
      catch (error) {
        console.error(error);
      }
      finally {
        setLoading((prev) => ({
          ...prev,
          trinerWiseBatches: false,
        }));
      }
    }
  };



  
  




  const [trainerBatchChart, setTrainerBatchChart] = useState(() => {
    return {
      series: [],
      options: {
        chart: {
          type: "rangeBar",
          height: 350,
          zoom: {
            enabled: false,
          },
          stacked: false,
          events: {
            scrolled: false
          },

        },
        plotOptions: {
          bar: {
            horizontal: true,
            rangeBarOverlap: true,
            rangeBarGroupRows: true,
          },
        },
        xaxis: {
          title: {
            text: "",
          },

          type: "numreic",
          min: 0, // 00:00 AM in minutes (0 minutes)
          max: 1440, // 11:59 PM in minutes (1440 minutes)
          tickAmount: 12, // Adjust ticks for 15-minute intervals
          labels: {
            formatter: (value) => {
              const hours = Math.floor(value / 60);
              const minutes = value % 60;
              const ampm = hours >= 12 ? "PM" : "AM";
              const displayHours = hours % 12 || 12;
              return `${displayHours.toFixed(0).toString().padStart(2, "0")}:${minutes.toFixed(0)
                .toString()
                .padStart(2, "0")} ${ampm}`;
            },
          },
        },
        yaxis: {
          categories: [],
        },

        grid: {
          xaxis: {
            lines: {
              show: true
            }
          }, yaxis: {
            lines: {
              show: true
            }
          }
        },

        tooltip: {
          y: {
            formatter: (value) => {
              const hours = Math.floor(value / 60);
              const minutes = value % 60;
              return `${hours.toFixed(0).toString().padStart(2, "0")}:${minutes.toFixed(0)
                .toString()
                .padStart(2, "0")}`;
            },
          },

        },
        colors: [],
        legend: {
          position: "bottom",
          horizontalAlign: "center",
          customLegendItems: [
            "0%",
            "1% - 9%",
            "10% - 50%",
            "50% - 90%",
            "90% - 100%",
          ],

          markers: {
            fillColors: ["#07bc0c", "#8e8c8c", "#f1c40f", "#eb6329", "#da3412"],
            shape: 'square',
            onClick: () => {
            }
          },
        },
      },
    };
  });

  



  useEffect(() => {
    fetchChartDataFromAnotherSource(branch?.branchId, filters?.curriculum?.value);
    const currentTime = new Date();
    const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }); // e.g., "14:45"
    const time = formattedTime < "11:59" && formattedTime > "00:00" ? true : false;
    setTime((prev) => ({
      ...prev,
      isAM: time ? true : false
    }));

    setTrainerBatchChart((prev) => ({
      ...prev,
      options: {
        ...prev.options,
        xaxis: {
          ...prev.options.xaxis,
          min: time ? 0 : 720,
          max: time ? 720 : 1440
        },
      },
    }));
  }, [filters.curriculum, branch?.branchId]);



  return (
    <div>
      <div className="container">

        {
          ((userData?.user?.profile === "Admin" ||
            userData?.user?.profile === "Support" ||
            userData?.user?.profile === "Regional Manager") && branch?.branchId === null) && (

            <div className="">


              <p>Today Active Batches </p>

              <ReactApexChart
                dir="ltr"
                className="apex-charts responsive-chart"
                options={todayActiveBatchesChart.options}
                series={todayActiveBatchesChart.series}
                type="bar"
                height={450}
              />
            </div>


          )
        }



        {
          branch?.branchId !== null ? Loading.trinerWiseBatches === true ? <>Loading...</> :
            (
              <div className="graph_height">
                <div className="row mb-2">
                  <div className="col-lg-3">
                    <Select
                      id="curriculum"
                      name="curriculum"
                      placeholder="Search the Curriculum"
                      classNamePrefix="Search"
                      className="fs-s bg-form text_color input_bg_color"
                      options={curriculumList.curriculumList ? curriculumList.curriculumList : []}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          curriculum: e
                        }))
                      }
                      value={filters.curriculum}
                      onInputChange={(inputValue) =>
                        handleQuerySearch(inputValue)
                      }
                      isClearable
                    />
                  </div>
                  <div className="col-lg-5 d-flex justify-content-center">
                    <input
                      type="checkbox"
                      id="toggle"
                      className="toggleCheckbox"
                      checked={time.isAM}
                      onChange={() => handletoggleTimeChage(!time.isAM)}
                    />
                    <label htmlFor="toggle" className="toggleContainer d-flex">

                      <div
                        className={`fw-500 fs-14 ${!time.isAM ? "active" : ""}`}
                        style={{ color: !time.isAM ? "#000" : "#aaa" }}
                      >
                        <IoMoonOutline className="fs-14" /> PM
                      </div>

                      <div
                        className={`fw-500 fs-14 ${time.isAM ? "active" : ""}`}
                        style={{ color: time.isAM ? "#000" : "#aaa" }}
                      >
                        <MdOutlineWbSunny className="fs-14" /> AM
                      </div>
                    </label>
                  </div>
                  <div className="col-lg-4 text-end">
                    {
                      (userData?.user?.profile === "Admin" ||
                        userData?.user?.profile === "Support" ||
                        userData?.user?.profile === "Regional Manager") && (
                        <div>
                          <button className="btn btn_primary fs-13" onClick={() => {
                            setBranch((prev) => ({
                              ...prev,
                              branchId: null
                            }))
                            setFilters((prev) => ({
                              ...prev,
                              curriculum: null,
                            }))
                          }}>
                            <AiOutlineRollback /> Back
                          </button>
                        </div>
                      )
                    }

                  </div>

                </div>
                <ReactApexChart
                  options={trainerBatchChart.options}
                  series={trainerBatchChart.series}
                  type="rangeBar"
                  height={550}
                />

              </div>
            )
            : null
        }

      </div>
    </div>
  );
};

export default GraphThree;
