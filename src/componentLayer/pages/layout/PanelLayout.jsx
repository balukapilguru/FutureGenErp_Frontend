import React, { useEffect, useLayoutEffect, useState } from "react";
import { Outlet, Routes, useLocation, useNavigate, useNavigation } from "react-router-dom";
import Sidemenu from ".././../components/sidemenu/Sidemenu";
import Topbar from ".././../components/topbar/Topbar";
import { useTheme } from "../../../dataLayer/context/themeContext/ThemeContext";
import { Footer } from "../../components/footer/Footer";
import BackButton from "../../components/backbutton/BackButton";
import useServiceWorker from "../../../useSw";
import useOnlineStatus from "../../../utils/useOnlineStatus.jsx";
import { useAuthContext } from "../../../dataLayer/hooks/useAuthContext";
import TopBarProgress from "react-topbar-progress-indicator";



// TopBarProgress.config({
//   barThickness: 5,
//   shadowBlur: 5,
//   barColors: {
//     "0.0": "#405189cf",
//     "0.5": "#405189cf",
//     "1.0": "#405189cf",
//   },
// });


TopBarProgress.config({
  barColors: {
    "0": '#405189',
    "0.10": "#405189",
    "1.0": '#ff7f50',
  },
  barThickness: 5,
  shadowBlur: 3,
});
 

function PanelLayout() {
  const { AuthState } = useAuthContext();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    if (window.screen.width < 786) {
      setIsExpanded(false)
    }
    else {
      setIsExpanded(true)
    }
  }, [])

  const { theme } = useTheme();
  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const isOnline = useOnlineStatus();
  const isLoggedIn = AuthState?.token ? true : false ?? false;

  const {
    usingSW,
    swRegistration,
    svcworker,
    sendSWMessage,
    sendStatusUpdate,
  } = useServiceWorker(isOnline, isLoggedIn);



  return (
    <div
      className={theme === "light" ? "app" : "darkMode app"}
      style={{ backgroundColor: "f3f3f9" }}
    >
      <Sidemenu
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        toggleSidebar={toggleSidebar}
      />
      <div
        className={` ${theme === "light" ? "content " : "darkMode content"}`}
        style={{ overflow: "auto" }}
      >
        <main className="">
          <Topbar
            isExpanded={isExpanded}
            setIsExpanded={setIsExpanded}
            toggleSidebar={toggleSidebar}
          />
          {isOnline ? null : (
            <span
              role='img'
              aria-label='Offline'
              style={{
                position: 'fixed',
                bottom: 0,
                right: 0,
                padding: '15px',
                // background: '#405189',
                 background: 'red',
                color: 'white',
                zIndex: 1000,
              }}
            >
              ⚠️ You are in  offline
            </span>
          )}
           {navigation.state === 'loading' && <TopBarProgress />}

          <Outlet />
          <div className="push"></div>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default PanelLayout;





// import React, { useEffect, useLayoutEffect, useState } from "react";
// import { Outlet, Routes, useLocation, useNavigate } from "react-router-dom";
// import Sidemenu from ".././../components/sidemenu/Sidemenu";
// import Topbar from ".././../components/topbar/Topbar";
// import { useTheme } from "../../../dataLayer/context/themeContext/ThemeContext";
// import { Footer } from "../../components/footer/Footer";
// import BackButton from "../../components/backbutton/BackButton";
// import useServiceWorker from "../../../useSw";
// import useOnlineStatus from "../../../utils/useOnlineStatus.jsx";
// import { useAuthContext } from "../../../dataLayer/hooks/useAuthContext";

// function PanelLayout() {
//   const { AuthState } = useAuthContext();
//   const [isExpanded, setIsExpanded] = useState(true);
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     if (window.screen.width < 786) {
//       setIsExpanded(false)
//     }
//     else {
//       setIsExpanded(true)
//     }
//   }, [])

//   const { theme } = useTheme();
//   const toggleSidebar = () => {
//     setIsExpanded(!isExpanded);
//   };

//   const isOnline = useOnlineStatus();
//   const isLoggedIn = AuthState?.token ? true : false ?? false;

//   const {
//     usingSW,
//     swRegistration,
//     svcworker,
//     sendSWMessage,
//     sendStatusUpdate,
//   } = useServiceWorker(isOnline, isLoggedIn);



//   return (
//     <div
//       className={theme === "light" ? "app" : "darkMode app"}
//       style={{ backgroundColor: "f3f3f9" }}
//     >
//       <Sidemenu
//         isExpanded={isExpanded}
//         setIsExpanded={setIsExpanded}
//         toggleSidebar={toggleSidebar}
//       />
//       <div
//         className={` ${theme === "light" ? "content " : "darkMode content"}`}
//         style={{ overflow: "auto" }}
//       >
//         <main className="">
//           <Topbar
//             isExpanded={isExpanded}
//             setIsExpanded={setIsExpanded}
//             toggleSidebar={toggleSidebar}
//           />
//           {isOnline ? null : (
//             <span
//               role='img'
//               aria-label='Offline'
//               style={{
//                 position: 'fixed',
//                 bottom: 0,
//                 right: 0,
//                 padding: '15px',
//                 // background: '#405189',
//                  background: 'red',
//                 color: 'white',
//                 zIndex: 1000,
//               }}
//             >
//               ⚠️ You are in  offline
//             </span>
//           )}

//           <Outlet />
//           <div className="push"></div>
//         </main>
//         <Footer />
//       </div>
//     </div>
//   );
// }

// export default PanelLayout;



