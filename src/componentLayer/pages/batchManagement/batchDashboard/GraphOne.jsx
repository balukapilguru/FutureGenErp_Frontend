import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { ERPApi } from "../../../../serviceLayer/interceptor.jsx";

const GraphOne = ({ batchInfo, branches }) => {

  const [chart, setChart] = useState({
    series: [
      {
        name: "Branch Wise Active Batches",
        data: [0, 0, 0, 0, 0, 0, 0, 0],
      },
      {
        name: "Total Active Students",
        data: [0, 0, 0, 0, 0, 0, 0, 0],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 410,
        toolbar: {
          show: false,
        },
      },
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
            fontSize: "8px",
          },
        },
      },
      legend: {
        fontSize: "12px",
      },
      colors: ["#e96228", "#405189"],
    },
  });

  // const FetchActiveBatchesAndBranches = async () => {
  //   try {
  //     const [BranchesList, BranchesActiveBatches] = await Promise.all([
  //       ERPApi.get(`/settings/getbranch`),
  //       ERPApi.get(`/batch/dashboard/batchinfo`) // Replace with your second API endpoint
  //     ]);


  //     if (BranchesList?.status === 200 && BranchesActiveBatches.status === 200) {
  //       const Branches = BranchesList.data;
  //       const BranchData = BranchesActiveBatches.data;

  //       if (Branches && Array.isArray(Branches)) {
  //         const branchNamesFromState = Branches?.map((branch) =>
  //           branch?.branch_name.trim().toLowerCase()
  //         );
  //         const activeBatches = Array(branchNamesFromState.length).fill(0);
  //         const activeStudents = Array(branchNamesFromState.length).fill(0);

  //         if (Array.isArray(BranchData) && BranchData.length > 0) {
  //           BranchData?.forEach((branch) => {
  //             const branchNameFromAPI = branch.branchName.trim().toLowerCase();
  //             const branchIndex = branchNamesFromState.indexOf(branchNameFromAPI);

  //             if (branchIndex !== -1) {
  //               activeBatches[branchIndex] = branch?.activeBatchCount;
  //               activeStudents[branchIndex] = branch?.studentCount;
  //             }
  //           });

  //           setChart((prevChart) => ({
  //             ...prevChart,
  //             series: [
  //               {
  //                 name: "Branch Wise Active Batches",
  //                 data: activeBatches,
  //               },
  //               {
  //                 name: "Total Active Students",
  //                 data: activeStudents,
  //               },
  //             ],
  //             options: {
  //               ...prevChart.options,
  //               xaxis: {
  //                 categories: branchNamesFromState.map(
  //                   (name) => name.replace(/\s/g, '').charAt(0).toUpperCase() + name.replace(/\s/g, '').slice(1)
  //                 ),
  //               },
  //             },
  //           }));
  //         }
  //       }
  //     }


  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };


  // useEffect(() => {
  //   FetchActiveBatchesAndBranches();
  // }, []);




  // New Updated Loader Functionality Starts here Above Commented Code will be removed Soon after testing if the system is stable


  const FetchActiveBatchesAndBranches = async () => {
    try{ 
    if (branches && batchInfo) {
        const Branches = branches?.branchData;
        const BranchData = batchInfo;

        if (Branches && Array.isArray(Branches)) {
          const branchNamesFromState = Branches?.map((branch) =>
            branch?.branch_name.trim().toLowerCase()
          );
          const activeBatches = Array(branchNamesFromState.length).fill(0);
          const activeStudents = Array(branchNamesFromState.length).fill(0);

          if (Array.isArray(BranchData) && BranchData.length > 0) {
            BranchData?.forEach((branch) => {
              const branchNameFromAPI = branch.branchName.trim().toLowerCase();
              const branchIndex = branchNamesFromState.indexOf(branchNameFromAPI);

              if (branchIndex !== -1) {
                activeBatches[branchIndex] = branch?.activeBatchCount;
                activeStudents[branchIndex] = branch?.studentCount;
              }
            });

            setChart((prevChart) => ({
              ...prevChart,
              series: [
                {
                  name: "Branch Wise Active Batches",
                  data: activeBatches,
                },
                {
                  name: "Total Active Students",
                  data: activeStudents,
                },
              ],
              options: {
                ...prevChart.options,
                xaxis: {
                  categories: branchNamesFromState.map(
                    (name) => name.replace(/\s/g, '').charAt(0).toUpperCase() + name.replace(/\s/g, '').slice(1)
                  ),
                },
              },
            }));
          }
        }
      }


    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  useEffect(() => {
    FetchActiveBatchesAndBranches();
  }, []);


  return (
    <div>
      <ReactApexChart
        dir="ltr"
        className="apex-charts"
        options={chart?.options}
        series={chart?.series}
        type="bar"
        height={400}
      />
    </div>
  );
};

export default GraphOne;
