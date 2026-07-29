import React, { useEffect, useState } from 'react';
import { ERPApi } from '../../../../serviceLayer/interceptor';

const UpcomingBatchesList = ({UpcomingBatchesList}) => {
  const [upcomingBatches, setUpcomingBatches] = useState([UpcomingBatchesList]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const { data, status } = await ERPApi.get(`batch/dashboard/upcoming`);
  //       if (status === 200) {
  //         setUpcomingBatches(data); // Assuming data is an array of batches
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };
  //   fetchData();
  // }, []);


  // Above commented Code will be remover after testing if the component works properly

  useEffect(() => {
    setUpcomingBatches(UpcomingBatchesList);
  }, [UpcomingBatchesList]);
  

  return (
    <div>
      <h6>Upcoming Batches</h6>
      <div className="table-responsive table-scroll table-card border-0 dashboard-tables mt-4">
        <table className="table table-centered align-middle table-nowrap equal-cell-table table-hover">
          <thead>
            <tr>
              <th scope="col" className="fs-13 lh-xs fw-600">S.No</th>
              <th scope="col" className="fs-13 lh-xs fw-600">Batch Name</th>
              <th scope="col" className="fs-13 lh-xs fw-600">Start Date</th>
              <th scope="col" className="fs-13 lh-xs fw-600">End Date</th>
              <th scope="col" className="fs-13 lh-xs fw-600">Days</th>
              <th scope="col" className="fs-13 lh-xs fw-600">Time</th>
              <th scope="col" className="fs-13 lh-xs fw-600">Mode</th>
              <th scope="col" className="fs-13 lh-xs fw-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {upcomingBatches && upcomingBatches?.length > 0 ? (
              upcomingBatches?.map((batch, index) => (
                <tr key={batch?.id}>
                  <td className="fs-13 black_300 fw-500 lh-xs bg_light">{index + 1}</td>
                  <td className="fs-13 black_300 fw-500 lh-xs bg_light">{batch?.batchName}</td>
                  <td className="fs-13 black_300 fw-500 lh-xs bg_light">{batch?.startDate}</td>
                  <td className="fs-13 black_300 fw-500 lh-xs bg_light">{batch?.endDate}</td>
                  <td className="fs-13 black_300 fw-500 lh-xs bg_light text-truncate" style={{ maxWidth: "120px" }} title={batch?.daysCollection}>{batch?.daysCollection?.join(', ')}</td>
                  <td className="fs-13 black_300 fw-500 lh-xs bg_light">
                    {batch?.startTime} - {batch?.endTime}
                  </td>
                  <td className="fs-13 black_300 fw-500 lh-xs bg_light">{batch?.trainingMode}</td>
                  <td className="fs-13 black_300 fw-500 lh-xs bg_light">{batch?.batchStatus}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center fs-13">No upcoming batches found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UpcomingBatchesList;
