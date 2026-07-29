

import { useState, useEffect } from "react";

const useFormattedDate = (inputDateString) => {
    const [formattedDate, setFormattedDate] = useState("");

    useEffect(() => {
        const date = new Date(inputDateString);
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
        const result = `${day < 10 ? "0" : ""}${day}-${monthAbbreviations[monthIndex]
            }-${year}`;

        // Updating the state with the formatted date
        setFormattedDate(result);
    }, [inputDateString]);

    return formattedDate;
};

export default useFormattedDate;
