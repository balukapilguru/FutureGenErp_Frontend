import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ERPApi } from "../../../../../serviceLayer/interceptor.jsx";
import { MdDateRange } from "react-icons/md";
import { MdOutlineOndemandVideo } from "react-icons/md";
import FormattedDate from "../../../../../utils/FormattedDate";

const BatchRecordings = () => {
  const { batchId } = useParams();
  const [recordingsData, setRecordingsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [playRecordings, setPlayRecordings] = useState({});

  // Fetch data
  const fetchRecordingsData = async () => {
    if (!batchId) return;

    setLoading(true);
    setError("");
    try {
      const response = await ERPApi.get(`/batch/getrecordings/${batchId}`);

      // const transformedData =
      //   response?.data?.map((item, index) => ({
      //     SNo: index + 1,
      //     date: item.date || "N/A",
      //     streamURL: item.streamCollection[0].streamUrl || "",
      //     duration: item.streamCollection[0].duration || "",

      //     modulesNames: item?.prod
      //       .map((item) => item.curriculumModule.moduleName.trim())
      //       .join(", "),
      //     topicsNames: item.prod
      //       .flatMap((item) =>
      //         item.topicCollection.map((topic) => topic.topicName.trim())
      //       )
      //       .join(", "),
      //   })) || [];


        const transformedData =response?.data?.flatMap((item, index) =>
        item.streamCollection.map((stream, idx) => ({
          SNo: index + 1,
          date: item.date || "N/A",
          streamURL: stream?.streamUrl || "",
          duration: stream?.duration || "",
          modulesNames: item?.prod
            ?.map((prodItem) => prodItem.curriculumModule?.moduleName?.trim())
            ?.join(", "),
          topicsNames: item?.prod
            ?.flatMap((prodItem) =>
              prodItem.topicCollection?.map((topic) => topic?.topicName?.trim())
            )
            ?.join(", "),
        }))
      ) || [];
      setRecordingsData(transformedData || []);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecordingsData();
  }, [batchId]);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              {loading ? (
                <p>Loading...</p>
              ) : error ? (
                <p className="text-danger">{error}</p>
              ) : (
                <div className="row">
                  {/* Video Section */}
                  <div className="col-lg-8 mb-4">
                    <h5 className="recording-title mt-2">
                      {playRecordings?.name || "Select a Recording"}
                    </h5>
                    <video
                      src={playRecordings?.streamUrl || ""}
                      controls
                      autoPlay
                      controlsList="nodownload"
                      className="w-100"
                    />
                  </div>

                  {/* Recordings Table */}
                  <div className="col-lg-4">
                    <h4 className="mt-1">Recordings</h4>
                    <div className="table-responsive">
                      <table className="table table-centered align-middle table-hover">
                        <tbody>
                          {recordingsData.length === 0 ? (
                            <tr>
                              <td className="text-center">No data available</td>
                            </tr>
                          ) : (
                            recordingsData.map((recording, index) => (
                              <tr
                                key={index}
                                onClick={() =>
                                  setPlayRecordings({
                                    streamUrl: recording?.streamURL,
                                    name: recording?.topicsNames,
                                  })
                                }
                                style={{ cursor: "pointer" }}
                              >
                                {/* <td className="text-center"></td> */}

                                {/* <td className="text-center">
                                  {recording?.date}
                                </td> */}
                                <td className="">
                                  <h6
                                    className="mt-2 lh-1 fw-bold text-truncate"
                                    style={{ maxWidth: "400px" }}
                                    title={recording?.topicsNames}
                                  >
                                    &nbsp;{index + 1}.&nbsp;
                                    {recording?.topicsNames}
                                  </h6>
                                  <p
                                    className="lh-1 ms-3 text-truncate"
                                    style={{ maxWidth: "400px" }}
                                    title={recording?.modulesNames}
                                  >
                                    {recording?.modulesNames}
                                  </p>
                                  <div className="pt-0 d-flex justify-content-between">
                                    <span className="lh-1 ms-3">
                                      <MdOutlineOndemandVideo className="mb-1 me-2" />
                                      <span className="icon_Color_recordings">
                                        {recording?.duration}
                                      </span>
                                    </span>
                                    <span className="lh-1 ms-3">
                                      <MdDateRange className="mb-1 me-2" />
                                      <span className="icon_Color_recordings">
                                        {FormattedDate(recording?.date)}
                                      </span>
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchRecordings;

// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { ERPApi } from "../../../../../serviceLayer/interceptor.jsx";

// const BatchRecordings = () => {
//   const { batchId } = useParams();
//   const [parentTableData, setParentTableData] = useState([]);
//   const [parentHeaders, setParentHeaders] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [playRecordings, setPlayRecordings] = useState({});

//   // Fetch data
//   const GetParentTableData = async () => {
//     if (!batchId) return;

//     setLoading(true);
//     setError("");
//     try {
//       const response = await ERPApi.get(
//         `/batch/attendance/topics?batchId=${batchId}`
//       );
//       const transformedData =
//         response?.data?.result?.map((item, index) => ({
//           SNo: index + 1,
//           Date: item.date || "N/A",
//           ModuleName: item?.data?.moduleDetails?.moduleName?.trim() || "N/A",
//           Topics:
//             item?.data?.topicDetails?.map((topic) => topic.topicName) || [],
//           Recordings:
//             item?.data?.recording?.map((rec) => ({
//               name: rec?.name || "N/A",
//               streamUrl: rec?.streamUrl || "#",
//             })) || [],
//         })) || [];
//         // const transformedData = [];

//         // response?.data?.result?.forEach((item) => {
//         //   const moduleName = item.data.moduleDetails.moduleName;
//         //   const topics = item.data.topicDetails.map((topic) => topic.topicName);
//         //   const date = item.date;

//         //   item.data.recording.forEach((recording) => {
//         //     transformedData.push({
//         //       date,
//         //       moduleName,
//         //       topics,
//         //       recording
//         //     });
//         //   });
//         // });

//       if (transformedData.length > 0) {
//         setParentHeaders(Object.keys(transformedData[0]));
//       } else {
//         setParentHeaders([]);
//       }

//       setParentTableData(transformedData);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       setError("Failed to fetch data. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     GetParentTableData();
//   }, [batchId]);

//   // Render rows
//   const renderTableRows = () => {
//     return parentTableData.map((row, rowIndex) => (
//       <tr key={rowIndex}>
//         {parentHeaders.map((header, headerIndex) => (
//           <td key={headerIndex} className="fs-13 black_300 lh-xs bg_light">
//             {Array.isArray(row[header]) ? (
//               <ul className="list-unstyled mb-0">
//                 {header === "Recordings"
//                   ? row[header].map((recording, recIndex) => (
//                       <li
//                         key={recIndex}
//                         className={`recording-item ${
//                           playRecordings?.streamUrl === recording?.streamUrl
//                             ? "active"
//                             : ""
//                         }`}
//                         onClick={() =>
//                           setPlayRecordings({
//                             streamUrl: recording?.streamUrl,
//                             name: recording?.name,
//                           })
//                         }
//                       >
//                         {recording?.name}
//                       </li>
//                     ))
//                   : row[header].map((item, itemIndex) => (
//                       <li key={itemIndex}>{item}</li>
//                     ))}
//               </ul>
//             ) : (
//               row[header]
//             )}
//           </td>
//         ))}
//       </tr>
//     ));
//   };

//   return (
//     <div className="container-fluid">
//       <div className="row">
//         <div className="col-lg-12">
//           <div className="card">
//             <div className="card-body">
//               {loading ? (
//                 <p>Loading...</p>
//               ) : error ? (
//                 <p className="text-danger">{error}</p>
//               ) : (
//                 <div className="row">
//                   {/* Video Section */}
//                    <div className="col-lg-8 mb-4">
//                     <h5 className="recording-title">{playRecordings?.name || "Select a Recording"}</h5>
//                     <video
//                       src={playRecordings?.streamUrl || ""}
//                       autoPlay={false}
//                       controls
//                       controlsList="nodownload"
//                       className="w-100"
//                     />
//                   </div>

//                   {/* Recordings Table */}
//                    <div className="col-lg-4">
//                     <h4 className="mt-3">Recordings</h4>
//                     <div className="table-responsive">
//                       <table className="table table-centered align-middle table-hover">
//                         <thead>
//                           <tr>
//                             {parentHeaders.map((header, index) => (
//                               <th key={index} className="fs-13 fw-600">
//                                 {header}
//                               </th>
//                             ))}
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {parentTableData.length === 0 ? (
//                             <tr>
//                               <td
//                                 colSpan={parentHeaders.length}
//                                 className="text-center"
//                               >
//                                 No data available
//                               </td>
//                             </tr>
//                           ) : (
//                             renderTableRows()
//                           )}
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BatchRecordings;

// import React, { useEffect, useState } from "react";
// import { MdRepartition } from "react-icons/md";
// import { ERPApi } from "../../../../../serviceLayer/interceptor.jsx";

// const BatchRecordings = ({ batchId }) => {
//   const [recordings, setRecordings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const getBatchRecordings = async () => {
//     try {
//       const response = await ERPApi.get(`/batch/getrecordings/${batchId}`);
//       setRecordings(response.data);
//     } catch (err) {
//       setError(err.message || "Failed to fetch recordings");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (batchId) {
//       getBatchRecordings();
//     }
//   }, [batchId]);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div>
//       <h2>
//         <MdRepartition /> Batch Recordings
//       </h2>
//       {recordings && recordings.length > 0 ? (
//         <ul>
//           {recordings.map((recording, index) => {
//             const streamUrl = recording.streamUrl;
//             return (
//               <li key={index}>
//                 <p>{recording.name || "Unnamed Recording"}</p>
//                 {streamUrl ? (
//                   <video
//                     src={streamUrl}
//                     autoPlay={false}
//                     controls
//                     controlsList="nodownload"
//                     width="100%"
//                     height="auto"
//                   ></video>
//                 ) : (
//                   <p>Stream URL not available</p>
//                 )}
//               </li>
//             );
//           })}
//         </ul>
//       ) : (
//         <p>No recordings available for this batch.</p>
//       )}
//     </div>
//   );
// };

// export default BatchRecordings;

// {
//   "result": [
//       {
//           "date": "2024-11-18",
//           "data": {
//               "moduleDetails": {
//                   "id": 149,
//                   "moduleName": " Module 1 Name (ex:HTML)"
//               },
//               "topicDetails": [
//                   {
//                       "id": 379,
//                       "topicName": " Topic 1 Name (ex:Tags)"
//                   }
//               ],
//               "recording": [
//                   {
//                       "streamUrl": "https://kapilguru-my.sharepoint.com/personal/erp_teksacademy_com/_layouts/15/download.aspx?UniqueId=dfefec79-0c91-4e53-bcbf-40418acf7248&Translate=false&tempauth=v1.eyJzaXRlaWQiOiIzMDhkNiLCJhdWQiOiIwMDAwMDAwMy0wMDAwLTBmZjEtY2UwMC0wMDAwMDAwMDAwMDAva2FwaWxndXJ1LW15LnNoYXJlcG9pbnQuY29tQDIwZDZjMWYxLTRkNGQtNDk3Ny1iY2E3LTJmZWYxZTkyYzFmMSIsImV4cCI6IjE3MzIwMTE0ODYifQ.CgoKBHNuaWQSAjY0EgsI1tKtwKOhxD0QBRoOMjAuMTkwLjE3NS4xNTIqLEYrWHRxVUorM04yZ0tSWHk5Z2IwZ3RhR1Jaa1RkcE9YK1lsaml4Z1B1Yms9MJgBOAFCEKFlXj1MoABAFUJvLwADm59KEGhhc2hlZHByb29mdG9rZW56ATG6AS1hbGxzaXRlcy5yZWFkIGFsbGZpbGVzLndyaXRlIGFsbHByb2ZpbGVzLnJlYWTCAUk2MzNmNzRiMy1mYjBlLTRkZTMtODMyNi1mYWUzNDZkYWUxYzJAMjBkNmMxZjEtNGQ0ZC00OTc3LWJjYTctMmZlZjFlOTJjMWYxyAEB.7tnxlWgzr-f76wIFJuR66hgAuoXuMhOyk2WPWajE18M&ApiVersion=2.0",
//                       "id": "01QKSD33DZ5TX57EIMKNHLZP2AIGFM64SI",
//                       "name": "TA80F-1124-16 - Forntend-20241119_050133-Meeting Recording.mp4",
//                       "date": "2024-11-19"
//                   },
//                   {
//                       "streamUrl": "https://kapilguru-my.sharepoint.com/personal/erp_teksacademy_com/_layouts/15/download.aspx?UniqueId=de36f45a-0f64-4b56-86f3-776044f054e2&Translate=false&tempauth=v1.eyJzaXRlaWQiOiIzMDOiJOb2RlX1NlbGYiLCJhdWQiOiIwMDAwMDAwMy0wMDAwLTBmZjEtY2UwMC0wMDAwMDAwMDAwMDAva2FwaWxndXJ1LW15LnNoYXJlcG9pbnQuY29tQDIwZDZjMWYxLTRkNGQtNDk3Ny1iY2E3LTJmZWYxZTkyYzFmMSIsImV4cCI6IjE3MzIwMTE0ODYifQ.CgoKBHNuaWQSAjY0EgsIhu_mwKOhxD0QBRoOMjAuMTkwLjE3NS4xNTIqLHdxZnV5dS9rY2VOYjlYeW1YZk9Ya2tSR3l4eWpMNDA2V3NNOWhXWVFxRE09MJgBOAFCEKFlXj1MoABAFUJvLwADm59KEGhhc2hlZHByb29mdG9rZW56ATG6AS1hbGxzaXRlcy5yZWFkIGFsbGZpbGVzLndyaXRlIGFsbHByb2ZpbGVzLnJlYWTCAUk2MzNmNzRiMy1mYjBlLTRkZTMtODMyNi1mYWUzNDZkYWUxYzJAMjBkNmMxZjEtNGQ0ZC00OTc3LWJjYTctMmZlZjFlOTJjMWYxyAEB.l4sbEb_IzbvsQ1VYvPT73xdEl2KxMaJ9hlC2jt_VBDU&ApiVersion=2.0",
//                       "id": "01QKSD33C26Q3N4ZAPKZFYN43XMBCPAVHC",
//                       "name": "TA80F-1124-16 - Forntend-20241119_051616-Meeting Recording.mp4",
//                       "date": "2024-11-19"
//                   },
//                   {
//                       "streamUrl": "https://kapilguru-my.sharepoint.com/personal/erp_teksacademy_com/_layouts/15/download.aspx?UniqueId=13e6fab3-89ed-43d8-a7ee-6b7be0974b3a&Translate=falsecHBfZGlzcGxheW5hbWUiOiJOb2RlX1NlbGYiLCJhdWQiOiIwMDAwMDAwMy0wMDAwLTBmZjEtY2UwMC0wMDAwMDAwMDAwMDAva2FwaWxndXJ1LW15LnNoYXJlcG9pbnQuY29tQDIwZDZjMWYxLTRkNGQtNDk3Ny1iY2E3LTJmZWYxZTkyYzFmMSIsImV4cCI6IjE3MzIwMTE0ODYifQ.CgoKBHNuaWQSAjY0EgsIwPj5wKOhxD0QBRoOMjAuMTkwLjE3NS4xNTIqLHk1VUVaajZWZWZ1QVVmSjlFTHZTZWw4V2tJa2NCZFA5VFJDK1drZCtBb3M9MJgBOAFCEKFlXj1MoABAFUJvLwADm59KEGhhc2hlZHByb29mdG9rZW56ATG6AS1hbGxzaXRlcy5yZWFkIGFsbGZpbGVzLndyaXRlIGFsbHByb2ZpbGVzLnJlYWTCAUk2MzNmNzRiMy1mYjBlLTRkZTMtODMyNi1mYWUzNDZkYWUxYzJAMjBkNmMxZjEtNGQ0ZC00OTc3LWJjYTctMmZlZjFlOTJjMWYxyAEB.D1FaGvjNZi9msNImHIKVhQDMSvsqB8tzpPqYIw3GWYk&ApiVersion=2.0",
//                       "id": "01QKSD33FT7LTBH3MJ3BB2P3TLPPQJOSZ2",
//                       "name": "TA80F-1124-16 - Forntend-20241119_090406-Meeting Recording.mp4",
//                       "date": "2024-11-19"
//                   }
//               ]
//           }
//       },
//       {
//         "date": "2024-11-19",
//         "data": {
//             "moduleDetails": {
//                 "id": 149,
//                 "moduleName": " Module 2 Name (ex:HTML)"
//             },
//             "topicDetails": [
//                 {
//                     "id": 379,
//                     "topicName": " Topic 2 Name (ex:Tags)"
//                 }
//             ],
//             "recording": [
//                 {
//                     "streamUrl": "https://kapilguru-my.sharepoint.com/personal/erp_teksacademy_com/_layefec79-0c91-4e53-bcbf-40418acf7248&Translate=false&tempauth=v1.eyJzaXRlaWQiOiIzMDhkNzRjZS0wZTBmLTQyMjEtOThlYS05MjBkNWI4Mzk4MGUiLCJhcHBfZGlzcGxheW5hbWUiOiJOb2RlX1NlbGYiLCJhdWQiOiIwMDAwMDAwMy0wMDAwLTBmZjEtY2UwMC0wMDAwMDAwMDAwMDAva2FwaWxndXJ1LW15LnNoYXJlcG9pbnQuY29tQDIwZDZjMWYxLTRkNGQtNDk3Ny1iY2E3LTJmZWYxZTkyYzFmMSIsImV4cCI6IjE3MzIwMTE0ODYifQ.CgoKBHNuaWQSAjY0EgsI1tKtwKOhxD0QBRoOMjAuMTkwLjE3NS4xNTIqLEYrWHRxVUorM04yZ0tSWHk5Z2IwZ3RhR1Jaa1RkcE9YK1lsaml4Z1B1Yms9MJgBOAFCEKFlXj1MoABAFUJvLwADm59KEGhhc2hlZHByb29mdG9rZW56ATG6AS1hbGxzaXRlcy5yZWFkIGFsbGZpbGVzLndyaXRlIGFsbHByb2ZpbGVzLnJlYWTCAUk2MzNmNzRiMy1mYjBlLTRkZTMtODMyNi1mYWUzNDZkYWUxYzJAMjBkNmMxZjEtNGQ0ZC00OTc3LWJjYTctMmZlZjFlOTJjMWYxyAEB.7tnxlWgzr-f76wIFJuR66hgAuoXuMhOyk2WPWajE18M&ApiVersion=2.0",
//                     "id": "01QKSD33DZ5TX57EIMKNHLZP2AIGFM64SI",
//                     "name": "TA80F-1124-16 - Forntend-20241119_050133-Meeting Recording.mp4",
//                     "date": "2024-11-19"
//                 },
//                 {
//                     "streamUrl": "https://kapilguru-my.sharepoint.com/personal/erp_teksacademy_com/_layde36f45a-0f64-4b56-86f3-776044f054e2&Translate=false&tempauth=v1.eyJzaXRlaWQiOiIzMDhkNzRjZS0wZTBmLTQyMjEtOThlYS05MjBkNWI4Mzk4MGUiLCJhcHBfZGlzcGxheW5hbWUiOiJOb2RlX1NlbGYiLCJhdWQiOiIwMDAwMDAwMy0wMDAwLTBmZjEtY2UwMC0wMDAwMDAwMDAwMDAva2FwaWxndXJ1LW15LnNoYXJlcG9pbnQuY29tQDIwZDZjMWYxLTRkNGQtNDk3Ny1iY2E3LTJmZWYxZTkyYzFmMSIsImV4cCI6IjE3MzIwMTE0ODYifQ.CgoKBHNuaWQSAjY0EgsIhu_mwKOhxD0QBRoOMjAuMTkwLjE3NS4xNTIqLHdxZnV5dS9rY2VOYjlYeW1YZk9Ya2tSR3l4eWpMNDA2V3NNOWhXWVFxRE09MJgBOAFCEKFlXj1MoABAFUJvLwADm59KEGhhc2hlZHByb29mdG9rZW56ATG6AS1hbGxzaXRlcy5yZWFkIGFsbGZpbGVzLndyaXRlIGFsbHByb2ZpbGVzLnJlYWTCAUk2MzNmNzRiMy1mYjBlLTRkZTMtODMyNi1mYWUzNDZkYWUxYzJAMjBkNmMxZjEtNGQ0ZC00OTc3LWJjYTctMmZlZjFlOTJjMWYxyAEB.l4sbEb_IzbvsQ1VYvPT73xdEl2KxMaJ9hlC2jt_VBDU&ApiVersion=2.0",
//                     "id": "01QKSD33C26Q3N4ZAPKZFYN43XMBCPAVHC",
//                     "name": "TA80F-1124-16 - Forntend-20241119_051616-Meeting Recording.mp4",
//                     "date": "2024-11-19"
//                 },
//                 {
//                     "streamUrl": "https://kapilguru-my.sharepoint.com/personal/erp_teksacapx?UniqueId=13e6fab3-89ed-43d8-a7ee-6b7be0974b3a&Translate=false&tempauth=v1.eyJzaXRlaWQiOiIzMDhkNzRjZS0wZTBmLTQyMjEtOThlYS05MjBkNWI4Mzk4MGUiLCJhcHBfZGlzcGxheW5hbWUiOiJOb2RlX1NlbGYiLCJhdWQiOiIwMDAwMDAwMy0wMDAwLTBmZjEtY2UwMC0wMDAwMDAwMDAwMDAva2FwaWxndXJ1LW15LnNoYXJlcG9pbnQuY29tQDIwZDZjMWYxLTRkNGQtNDk3Ny1iY2E3LTJmZWYxZTkyYzFmMSIsImV4cCI6IjE3MzIwMTE0ODYifQ.CgoKBHNuaWQSAjY0EgsIwPj5wKOhxD0QBRoOMjAuMTkwLjE3NS4xNTIqLHk1VUVaajZWZWZ1QVVmSjlFTHZTZWw4V2tJa2NCZFA5VFJDK1drZCtBb3M9MJgBOAFCEKFlXj1MoABAFUJvLwADm59KEGhhc2hlZHByb29mdG9rZW56ATG6AS1hbGxzaXRlcy5yZWFkIGFsbGZpbGVzLndyaXRlIGFsbHByb2ZpbGVzLnJlYWTCAUk2MzNmNzRiMy1mYjBlLTRkZTMtODMyNi1mYWUzNDZkYWUxYzJAMjBkNmMxZjEtNGQ0ZC00OTc3LWJjYTctMmZlZjFlOTJjMWYxyAEB.D1FaGvjNZi9msNImHIKVhQDMSvsqB8tzpPqYIw3GWYk&ApiVersion=2.0",
//                     "id": "01QKSD33FT7LTBH3MJ3BB2P3TLPPQJOSZ2",
//                     "name": "TA80F-1124-16 - Forntend-20241119_090406-Meeting Recording.mp4",
//                     "date": "2024-11-19"
//                 }
//             ]
//         }
//     }
//   ],
//   "existingBatchProductivityJunction": [
//       {
//           "id": 56,
//           "batchId": 28,
//           "trainerId": 230,
//           "curriculumId": 28,
//           "curriculumModuleId": 146,
//           "topicCollection": [
//               371,
//               372
//           ],
//           "date": "2024-11-19",
//           "createdAt": "2024-11-19T09:03:14.000Z",
//           "updatedAt": "2024-11-19T09:03:14.000Z"
//       },
//       {
//           "id": 57,
//           "batchId": 28,
//           "trainerId": 230,
//           "curriculumId": 28,
//           "curriculumModuleId": 149,
//           "topicCollection": [
//               379
//           ],
//           "date": "2024-11-19",
//           "createdAt": "2024-11-19T09:11:02.000Z",
//           "updatedAt": "2024-11-19T09:11:02.000Z"
//       }
//   ]
// }
