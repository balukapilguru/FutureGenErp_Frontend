import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import "../../../assets/css/UserView.css";
import BackButton from "../../components/backbutton/BackButton";
import { ERPApi } from "../../../serviceLayer/interceptor";
import Defaultimg from "../../../assets/images/student_idCard_images/Defaultimg.jpg";
import { toast } from "react-toastify";
export const profileViewLoader = async ({ params }) => {
  try {
    const { data, status } = await ERPApi.get(`/user/viewuser/${params?.id}`);
    if (status === 200) {
      const userData = data?.user;
      return { userData };
    }
  } catch (error) {
    console.error(error);
  }
};

const ProfileView = () => {
  const data = useLoaderData();
  const singleUser = data?.userData;


  const [userData, setUserData] = useState(() => {
    const data = JSON.parse(localStorage.getItem("data"));
    return data || "";
  });

  const [image, setImage] = useState(singleUser?.userProfileImage);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const userId = userData?.user?.id;

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Handle image upload
  const handleUploadClick = () => {
    if (!selectedFile) {
      toast.error("Please select an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("userProfileImage", selectedFile);

    ERPApi.put(`/user/updateuser/${userId}`, formData)
      .then((response) => {
        if (response.status === 200) {
          setImage(URL.createObjectURL(selectedFile));
          toast.success("Image updated successfully");
        }
      })
      .catch((error) => {
        console.error("Error updating image:", error);
        toast.error("Error updating image");
      });
  };

  return (
    <div>
      <BackButton
        heading={`${
          userId === Number(singleUser?.id) ? `User Profile` : "Profile View"
        }`}
        content="Back"
        to="/"
      />
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-4 mt-2 profile_view text-center">
            <div className="card h-100">
              <div className="rounded-top">
                <div className="btn_primary text-center rounded-top">
                  <h6 className="py-2 mb-0">Welcome to Teks Academy</h6>
                </div>
                <div className="my-2">
                  {singleUser?.userProfileImage ? (
                    <img
                      src={image}
                      alt="user-img"
                      className="profile-img rounded-circle thumbnail"
                    />
                  ) : (
                    <img
                      src={imagePreview || Defaultimg}
                      alt="user-img"
                      className="profile-img rounded-circle thumbnail"
                    />
                  )}
                </div>
                <div className="ps-1">
                  <h3 className="black_300 mb-0">{singleUser?.fullname}</h3>
                  <p className="text-mute fs-lg fw-500 mb-1">
                    {singleUser?.profile}
                  </p>
                  <p className="text-mute fs-lg fw-500 mb-1">
                    {singleUser?.branch}
                  </p>
                </div>
                {/* <input
                  type="file"
                  accept="image/*"
                 
                  className="mt-2"
                /> */}
                <div className="mt-3">
                  <input
                    type="file"
                    accept="image/*"
                    id="upload-image"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                  <label
                    htmlFor="upload-image"
                    className="btn btn_primary"
                    style={{ cursor: "pointer" }}
                  >
                    Upload Image
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-8 mt-2 profile_view">
            <div className="card h-100">
              <div className="card-body">
                <ul className="nav mb-3 nav-tabs" id="pills-tab" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button
                      className="card card_animate nav-link active"
                      id="pills-home-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-home"
                      type="button"
                      role="tab"
                      aria-controls="pills-home"
                      aria-selected="true"
                    >
                      OverView
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="card card_animate nav-link ms-3"
                      id="pills-profile-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-profile"
                      type="button"
                      role="tab"
                      aria-controls="pills-profile"
                      aria-selected="false"
                    >
                      Remarks
                    </button>
                  </li>
                </ul>
                <div className="tab-content" id="pills-tabContent">
                  <div
                    className="tab-pane fade show active"
                    id="pills-home"
                    role="tabpanel"
                    aria-labelledby="pills-home-tab"
                    tabIndex="0"
                  >
                    <div className="row">
                      <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                        <div className="lh-400">
                          <p className="ps-0 black_300 fw-600 mt-0 mb-0">
                            About
                          </p>
                          <p className="text-mute mt-0 fs-13">
                            Hi I&apos;m {singleUser?.fullname},{" "}
                            {singleUser?.aboutuser}
                          </p>
                        </div>
                        <p className="ps-0 black_300 fw-600 mt-0 mb-1">
                          Profile
                        </p>
                        <div className="profile_bg table-scroll">
                          <table className="table table-centered align-middle table-nowrap equal-cell-table table-hover">
                            <tbody className="fs-13">
                              <tr className="lh-400">
                                <td
                                  className="ps-0 black_300 fw-500"
                                  scope="row"
                                >
                                  Full Name
                                </td>
                                <td
                                  className="text-mute text-truncate"
                                  style={{ maxWidth: "200px" }}
                                  title={singleUser?.fullname}
                                >
                                  <span className="ms-5">: </span>
                                  {singleUser?.fullname}
                                </td>
                              </tr>
                              <tr className="lh-400">
                                <td
                                  className="ps-0 black_300 fw-500"
                                  scope="row"
                                >
                                  Email
                                </td>
                                <td className="text-mute">
                                  <span className="ms-5">: </span>
                                  {singleUser?.email}
                                </td>
                              </tr>
                              <tr className="lh-400">
                                <td
                                  className="ps-0 black_300 fw-500"
                                  scope="row"
                                >
                                  Phone No
                                </td>
                                <td className="text-mute">
                                  <span className="ms-5">: </span>
                                  {singleUser?.phonenumber}
                                </td>
                              </tr>
                              <tr className="lh-400">
                                <td
                                  className="ps-0 black_300 fw-500"
                                  scope="row"
                                >
                                  Designation
                                </td>
                                <td className="text-mute">
                                  <span className="ms-5">: </span>
                                  {singleUser?.designation}
                                </td>
                              </tr>
                              <tr className="lh-400">
                                <td
                                  className="ps-0 black_300 fw-500"
                                  scope="row"
                                >
                                  Department
                                </td>
                                <td className="text-mute">
                                  <span className="ms-5">: </span>
                                  {singleUser?.department}
                                </td>
                              </tr>
                              <tr className="lh-400">
                                <td
                                  className="ps-0 black_300 fw-500"
                                  scope="row"
                                >
                                  Report To
                                </td>
                                <td className="text-mute">
                                  <span className="ms-5">: </span>
                                  {singleUser?.reportto}
                                </td>
                              </tr>
                              <tr className="lh-400">
                                <td
                                  className="ps-0 black_300 fw-500"
                                  scope="row"
                                >
                                  Profile
                                </td>
                                <td className="text-mute">
                                  <span className="ms-5">: </span>
                                  {singleUser?.profile}
                                </td>
                              </tr>
                              <tr className="lh-400">
                                <td
                                  className="ps-0 black_300 fw-500"
                                  scope="row"
                                >
                                  Branch
                                </td>
                                <td className="text-mute">
                                  <span className="ms-5">: </span>
                                  {singleUser?.branch}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="text-end">
                          <button
                            onClick={handleUploadClick}
                            className="btn btn_primary mt-2"
                          >
                            Update
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="tab-pane fade "
                    id="pills-profile"
                    role="tabpanel"
                    aria-labelledby="pills-profile-tab"
                    tabIndex="0"
                  >
                    <div className="row">
                      <div className="col-lg-6">
                        <table className="table">
                          <thead className="">
                            <tr className="">
                              <th className="text_color fs-14">Date</th>
                              <th className=" text_color fs-14">Status</th>
                              <th scope="col" className=" text_color fs-14">
                                Review
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {singleUser?.user_remarks_history &&
                              singleUser?.user_remarks_history.map(
                                (userstatus, index) => {
                                  const date = new Date(userstatus?.date);
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
                                  // Formatting the date
                                  const Formatteddate = `${
                                    day < 10 ? "0" : ""
                                  }${day}-${
                                    monthAbbreviations[monthIndex]
                                  }-${year}`;
                                  return (
                                    <tr key={index}>
                                      <td className="table-cell-heading text_color fs-14">
                                        {Formatteddate}
                                      </td>

                                      {userstatus?.Activate_remarks && (
                                        <td className="table-cell-heading text_color fs-14">
                                          Active
                                        </td>
                                      )}
                                      {userstatus?.Inactivate_remarks && (
                                        <td className="table-cell-heading text_color fs-14">
                                          Inactive
                                        </td>
                                      )}
                                      {userstatus?.Activate_remarks && (
                                        <td className="table-cell-heading text_color fs-14">
                                          {userstatus?.Activate_remarks}
                                        </td>
                                      )}
                                      {userstatus?.Inactivate_remarks && (
                                        <td className="table-cell-heading text_color fs-14">
                                          {userstatus?.Inactivate_remarks}
                                        </td>
                                      )}
                                    </tr>
                                  );
                                }
                              )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
