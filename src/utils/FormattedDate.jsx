



import React from "react";

const FormattedDate = (date1, date2) => {
    const formatDate = (admissionDate) => {
        const date = new Date(admissionDate);
        const day = date.getUTCDate();
        const monthIndex = date.getUTCMonth();
        const year = date.getUTCFullYear();
        const monthAbbreviations = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        return `${day < 10 ? "0" : ""}${day}-${monthAbbreviations[monthIndex]}-${year}`;
    };

    return (
        <span>
            {formatDate(date1)}
            {date2 && ` to ${formatDate(date2)}`}
        </span>
    );
};

export default FormattedDate;




// import React from "react";
// const FormattedDate = ( date ) => {
//     const formatDate = (admissionDate) => {
//         const date = new Date(admissionDate);
//         const day = date.getUTCDate();
//         const monthIndex = date.getUTCMonth();
//         const year = date.getUTCFullYear();
//         const monthAbbreviations = [
//             "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//             "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
//         ];
//         return `${day < 10 ? "0" : ""}${day}-${monthAbbreviations[monthIndex]}-${year}`;
//     };
//     return <span>{formatDate(date)}</span>;
// };

// export default FormattedDate;




