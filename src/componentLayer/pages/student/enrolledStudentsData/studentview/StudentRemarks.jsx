import React from "react";
import BackButton from "../../../../components/backbutton/BackButton";
import { useLoaderData } from "react-router-dom";
import { ERPApi } from "../../../../../serviceLayer/interceptor";

export const StudentRemarksLoader = async ({ request }) => {
  const url = new URL(request.url);
  const studentId = url.searchParams.get("studentId");

  try {
    // const studentId = sessionStorage.getItem("id")
    const { data, status } = await ERPApi.get(
      `/student/viewstudentdata/${studentId}`
    );

    if (status === 200) {
      const studentData = data?.student[0];
      return { studentData };
    }
  } catch (error) {
    console.error("safbahfsfd", error);
    return null;
  }
};

const StudentRemarks = () => {
  const data = useLoaderData();


  const activity = data?.studentData?.reason
 
  return (
    <div className="container-fluid">
      <div className="card">
        <div className="row">
          <div className="col-lg-12">
            <table className="table table-nowrap">
              <thead className="">
                <tr className="">
                <th className="text_color fs-14">S.NO</th>
                  <th className="text_color fs-14">Date</th>
                  <th className=" text_color fs-14">Status</th>
                  <th scope="col" className=" text_color fs-14">
                    Review
                  </th>
                </tr>
              </thead>
              <tbody>
                {activity && activity?.length > 0 ?(activity.map((userstatus, index) => {
                    const date = new Date(userstatus?.updatedAt);
                    const day = date.getUTCDate();
                    const monthIndex = date.getUTCMonth();
                    const year = date.getUTCFullYear();

                    const monthAbbreviations = [
                      "Jan",
                      "Feb",
                      "Mar",
                      "Apr",
                      "May",
                      "Jun",
                      "Jul",
                      "Aug",
                      "Sep",
                      "Oct",
                      "Nov",
                      "Dec",
                    ];

                    const Formatteddate = `${day < 10 ? "0" : ""}${day}-${
                      monthAbbreviations[monthIndex]
                    }-${year}`;
                    return (
                      <tr key={index}>
                        <td className="table-cell-heading text_color fs-14">
                          {index+1}
                        </td>
                        <td className="table-cell-heading text_color fs-14">
                          {Formatteddate}
                        </td>

                        <td className="table-cell-heading text_color fs-14">
                          {userstatus?.status}
                        </td>

                        <td className="table-cell-heading text_color fs-14">
                          {userstatus?.description}
                        </td>
                      </tr>
                    );
                  })) : (<tr>
                    <td
                      colSpan="4"
                      className="table-cell-heading text_color fs-14 text-center"
                    >
                      No Remarks Found
                    </td>
                  </tr>) }
                
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentRemarks;
