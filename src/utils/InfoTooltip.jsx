import React from "react";
import { BsInfoCircle } from "react-icons/bs";

const InfoTooltip = ({ text = "Add Instructions here", position = "right" }) => {
    return (
        <div
            className="position-relative d-inline-flex align-items-center"
            style={{ cursor: "pointer" }}
        >
            <BsInfoCircle className="info-icon" />

            <div className={`custom-tooltip tooltip-${position}`}>
                {text}
            </div>

        </div>
    );
};

export default InfoTooltip;