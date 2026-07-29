
const TimeConverter = (startTime, endTime) => {
    const formatTime = (time) => {
        let [hours, minutes] = time.split(':');
        hours = parseInt(hours, 10);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; 
        minutes = minutes?.padStart(2, '0');
        return `${hours}:${minutes} ${ampm}`;
    };
    const formattedStartTime = startTime ? formatTime(startTime) : null;
    const formattedEndTime = endTime ? formatTime(endTime) : null;
    return formattedEndTime ? `${formattedStartTime} - ${formattedEndTime}` : formattedStartTime;
};

export default TimeConverter;
