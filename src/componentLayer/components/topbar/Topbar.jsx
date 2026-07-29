import React, { useContext, useState } from "react";
import { MdFullscreen } from "react-icons/md";
import { MdOutlinePassword, MdOutlineFullscreenExit } from "react-icons/md";
import { HiOutlineLogout } from "react-icons/hi";
import "../../../assets/css/Topbar.css";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../dataLayer/context/authContext/AuthContextProvider";
import { CiMenuFries } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { useTheme } from "../../../dataLayer/context/themeContext/ThemeContext";



const Topbar = ({ isExpanded, toggleSidebar }) => {
  const { userLogout, } = useContext(AuthContext);
  const { setDarkMode, theme } = useTheme();
  const navigate = useNavigate();

 


  const [userData, setUserData] = useState(() => {
    const data = JSON.parse(localStorage.getItem("data"));
    return data || "";
  });

  let id = userData?.user?.id;

  const [isDropdownActive, setIsDropdownActive] = useState(false);
  const [largeScreen, setLargeScreen] = useState(false);


  const dropdownHandler = () => {
    setIsDropdownActive((dropdown) => !dropdown);
  };


  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setLargeScreen((prev) => !prev);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setLargeScreen((prev) => !prev);
      }
    }
  };


  return (
    <div className="topbar w-full">
      <nav
        className={`navbar-header border-bottom border-1 ${isExpanded ? "navbar-header-min" : "navbar-header-max"
          } `}
      >
        <div className="d-flex justify-content-between py-2">
          {/* Left */}
          <div>
            <div>
            
              <span onClick={toggleSidebar}>
                <CiMenuFries className="navbar_icons text-mute  fw-500" />
              </span>
            </div>
          </div>
          {/* Right */}
          <div className="">
            <div className="d-flex gap-2 align-items-center">
              <div className="nav-item">
                {largeScreen ? (
                  <MdOutlineFullscreenExit
                    className="navbar_icons"
                    onClick={toggleFullScreen}
                    title="Exit Full Screen"
                  />
                ) : (
                  <MdFullscreen
                    className="navbar_icons"
                    onClick={toggleFullScreen}
                    title="Enter Full Screen"
                  />
                )}
              </div>
             
              <div className="topbar_profile w-100 ">
                <div
                  aria-expanded="false"
                  data-bs-toggle="dropdown"
                  className="d-flex align-items-center gap-2"
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src="https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small/user-profile-icon-free-vector.jpg"
                    className="avatar img-fluid "
                    alt="User Avatar"
                  />
                  
                </div>
                <ul className="dropdown-menu bg_white ">
                  <li>
                    <Link
                      className={
                        theme === "dark"
                          ? "dropdown-item dropdown-item-dark"
                          : "dropdown-item"
                      }
                      to={`/user/profileview/${id}`}
                    >
                      <span className="fs-13 text_color d-flex gap-2 align-items-center">
                        <CgProfile className="fs-13 text_color" />
                        Profile
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={
                        theme === "dark"
                          ? "dropdown-item dropdown-item-dark"
                          : "dropdown-item"
                      }
                      to={"/auth/changepassword"}
                    >
                      <span className="fs-13 text_color d-flex gap-2 align-items-center">
                        <MdOutlinePassword className="fs-13 text_color" />
                        Change Password
                      </span>
                    </Link>
                  </li>
                
                  <li onClick={()=>userLogout(navigate)}>
                    <Link
                      className={
                        theme === "dark"
                          ? "dropdown-item dropdown-item-dark"
                          : "dropdown-item"
                      }
                    >
                      <span className="fs-13 text_color d-flex gap-2 align-items-center">
                        <HiOutlineLogout className="fs-13 text_color" /> Logout
                      </span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};
export default Topbar;
