// convert month integer into formatted month string
const monthFormat = (month, abbeviate = false) => {
    const months = [
        'January', 
        'February', 
        'March', 
        'April', 
        'May', 
        'June', 
        'July', 
        'August', 
        'September', 
        'October',
        'November',
        'December'
    ]

    const formattedMonth = abbreviate ? months[month].substring(0,3) : months[month];
    return formattedMonth;
}

// convert day integer to formatted day string
const dayFormat = (date) => {
    let dateStr = date.toString();

    // get last char of date string
    const lastChar = dateStr.charAt(dateStr.length - 1);

    if (lastChar === '1' && dateStr !== '11') {
        dateStr = `${dateStr}st`;
    } else if (lastChar === '2' && dateStr !== '12') {
        dateStr = `${dateStr}nd`;
    } else if (lastChar === '3' && dateStr !== '13') {
        dateStr = `${dateStr}rd`;
    } else {
        dateStr = `${dateStr}th`;
    }

    return dateStr;
};

// convert hour to 12-hr clock
const hourFormat = (hour) => {
    let formattedHour = hour > 12
    ? Math.floor(dateObj.getHours() - 12)
    : dateObj.getHours();

    // convert 0 to midnight (12)
    if (formattedHour === 0) {
        formattedHour = 12;
    }

    return formattedHour;
}

//convert timestamp to formatted date string
const dateFormat = (timestamp) => {
    
    const dateObj = new Date(timestamp);
    const monthStr = monthFormat(dateObj.getMonth());
    const dayStr = dayFormat(dateObj.getDate());
    const yearStr = dateObj.getFullYear();
    const hourStr = hourFormat(dateObj.getHours());
    // pad single digits with leading zero
    const minuteStr = (dateObj.getMinutes() < 10 ? '0' : '') + dateObj.getMinutes();
    const designationStr = dateObj.getHours() >= 12 ? 'pm' : 'am';
    const formattedDate = `${monthStr} ${dayStr}, ${yearStr} at ${hourStr}:${minuteStr} ${designationStr}`;

    return formattedDate;
}

module.exports = dateFormat;

  