import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export const showLoadingPopup = (
    title = "Loading...",
    html = "Please Wait while we process your request."
) => {
    MySwal.fire({
        title,
        html,
        allowOutsideClick: false,
        background: "#f4f4f4", 
        color: "#333", // Text color
        customClass: {
            title: "swal-title", // Custom class for title
            htmlContainer: "swal-html", // Custom class for html content
        },
        didOpen: () => {
            Swal.showLoading(); // Display loading spinner
        },
    });
};

export const closeLoadingPopup = () => {
    Swal.close();
};
