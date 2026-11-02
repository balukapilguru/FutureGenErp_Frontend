import { useEffect, useRef, useState } from "react";
import { MdLocalPrintshop, MdFileDownload } from "react-icons/md";
import { useReactToPrint } from "react-to-print";
import "../../../../assets/css/StudentIdCard.css";
import Button from "../../../components/button/Button";
import BackButton from "../../../components/backbutton/BackButton";
import { ERPApi } from "../../../../serviceLayer/interceptor";
import html2canvas from "html2canvas";
import Defaultimg from "../../../../assets/images/student_idCard_images/DefaultimgBG.png";
import { useLoaderData } from "react-router-dom";
import fgLogo from "../../../../assets/images/FG-LOGO.png";

export const studentIdCardLoader = async ({ params }) => {
  try {
    const { data, status } = await ERPApi.get(
      `/student/viewstudentdata/${params?.id}`
    );
    if (status === 200) {
      const studentData = data?.student[0];
      return { studentData };
    }
  } catch (error) {
    console.error("Error fetching student data:", error);
  }
};

const formatStudentImageUrl = (imgName) => {
  if (!imgName) return null;
  if (imgName.startsWith("http://") || imgName.startsWith("https://")) {
    return imgName;
  }
  const cleanName = imgName.startsWith("/") ? imgName.slice(1) : imgName;
  const encodedName = encodeURI(decodeURI(cleanName));
  return `https://futuregen.s3.ap-south-1.amazonaws.com/studentManagement/regStudentImgs/${encodedName}`;
};

const convertImageToBase64 = async (url) => {
  try {
    const separator = url.includes("?") ? "&" : "?";
    // Adding timestamp query param bypasses poisoned browser cache from non-CORS image requests
    const cacheBusterUrl = `${url}${separator}t=${Date.now()}`;
    const response = await fetch(cacheBusterUrl, { mode: "cors" });
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.warn("Failed to convert image to base64:", err);
    return null;
  }
};

const StudentIdCard = () => {
  const data = useLoaderData();
  const studentData = data?.studentData;
  const componentRefff = useRef();

  const [studentPhoto, setStudentPhoto] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const studentImageUrl = formatStudentImageUrl(studentData?.studentImg);

  // Pre-load student image as Base64 to prevent CORS taint issues during html2canvas and print
  useEffect(() => {
    let isMounted = true;

    if (!studentImageUrl) {
      setStudentPhoto(Defaultimg);
      setImageLoaded(true);
      return;
    }

    convertImageToBase64(studentImageUrl).then((base64) => {
      if (isMounted) {
        if (base64) {
          setStudentPhoto(base64);
        } else {
          // Fallback to direct URL if conversion failed
          setStudentPhoto(studentImageUrl);
        }
        setImageLoaded(true);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [studentImageUrl]);

  const downloadIdCard = async () => {
    if (!imageLoaded) {
      alert("Please wait, the image is still loading.");
      return;
    }

    if (!componentRefff.current) return;

    try {
      setIsDownloading(true);

      // Ensure any remote <img> within the element is converted to base64 before capturing
      const imgElements = componentRefff.current.querySelectorAll("img");
      for (const img of imgElements) {
        if (
          img.src &&
          img.src.startsWith("http") &&
          !img.src.startsWith(window.location.origin) &&
          !img.src.startsWith("data:")
        ) {
          const b64 = await convertImageToBase64(img.src);
          if (b64) {
            img.src = b64;
          }
        }
      }

      // Small pause to ensure DOM update is rendered
      await new Promise((resolve) => setTimeout(resolve, 100));

      const canvas = await html2canvas(componentRefff.current, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: null,
        logging: false,
      });

      canvas.toBlob((blob) => {
        if (!blob) {
          alert("Failed to generate image.");
          return;
        }
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        const safeName = studentData?.name
          ? studentData.name.trim().replace(/\s+/g, "_")
          : "student";
        link.download = `student_id_card_${safeName}.png`;
        link.click();
        URL.revokeObjectURL(link.href);
      }, "image/png");
    } catch (error) {
      console.error("ID Card Download Error:", error);
      alert("Failed to download ID card. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
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
    return `${day < 10 ? "0" : ""}${day}-${monthAbbreviations[monthIndex]}-${year}`;
  };

  const handlePrint = useReactToPrint({
    content: () => componentRefff.current,
  });

  return (
    <div>
      <BackButton heading="Student Id Card" content="Back" />
      <div className="container-fluid">
        <div className="text-end p-3">
          <Button className="btn btn_primary me-2" onClick={handlePrint}>
            <MdLocalPrintshop /> Print
          </Button>
          <Button
            className="btn btn_primary me-2"
            onClick={downloadIdCard}
            disabled={!imageLoaded || isDownloading}
          >
            <MdFileDownload /> {isDownloading ? "Downloading..." : "Download ID Card"}
          </Button>
        </div>

        <div className="studentid">
          <div className="idcard1" ref={componentRefff}>
            <div className="teksimg">
              <img className="mb-4" src={fgLogo} alt="Logo" />
            </div>
            <div className="card_Content">
              <div className="studid-photo text-center">
                <img
                  src={studentPhoto || studentImageUrl || Defaultimg}
                  alt="Student Img"
                  crossOrigin="anonymous"
                  onLoad={() => setImageLoaded(true)}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = Defaultimg;
                    setImageLoaded(true);
                  }}
                />
              </div>

              <p className="student_name">{studentData?.name}</p>
              <div className="student-info text-left">
                <p className="fs-14 black_300">
                  Registration No: {studentData?.registrationnumber}
                </p>
                <p className="fs-14 black_300">
                  Course: {studentData?.courses}
                </p>
                <p className="fs-14 black_300">
                  Branch: {studentData?.branch}
                </p>
                <p className="fs-14 black_300">
                  Valid Upto:{" "}
                  {studentData?.validityenddate
                    ? formatDate(studentData.validityenddate)
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentIdCard;
