parseTime = function(timeString, relativeTime) {
var date = new Date(timeString);

if (relativeTime) {
    var secondsSinceSent = ((new Date().getTime() - date.getTime()) / 1000);
    var minutesSinceSent = secondsSinceSent / 60;
    var hoursSinceSent = minutesSinceSent / 60;
    var daysSinceSent = hoursSinceSent / 24;
    var weeksSinceSent = daysSinceSent / 7;
    var monthsSinceSent = minutesSinceSent / 43800; // There are exactly 43800 minutes in a month
    var yearsSinceSent = monthsSinceSent / 12;

    secondsSinceSent = Math.round(secondsSinceSent);
    if(secondsSinceSent <= 0) {
        return 'Just now';
    }
    minutesSinceSent = Math.round(minutesSinceSent);
    hoursSinceSent = Math.round(hoursSinceSent);
    daysSinceSent = Math.round(daysSinceSent);
    weeksSinceSent = Math.round(weeksSinceSent);
    monthsSinceSent = Math.round(monthsSinceSent);
    yearsSinceSent = Math.round(yearsSinceSent);

    if (secondsSinceSent < 60) {
        var seconds = Math.round(secondsSinceSent);
        if (seconds === 1) {
            return seconds + ' second ago';
        } else {
            return seconds + ' seconds ago';
        }
    }
    if (minutesSinceSent < 60) {
        if (minutesSinceSent === 1) {
            return minutesSinceSent + ' minute ago';
        } else {
            return minutesSinceSent + ' minutes ago';
        }
    }
    if (hoursSinceSent < 24) {
        if (hoursSinceSent === 1) {
            return hoursSinceSent + ' hour ago';
        } else {
            return hoursSinceSent + ' hours ago';
        }
    }
    if (daysSinceSent < 7) {
        if (daysSinceSent === 1) {
            return daysSinceSent + ' day ago';
        } else {
            return daysSinceSent + ' days ago';
        }
    }
    if (weeksSinceSent < 4) {
        if (weeksSinceSent === 1) {
            return weeksSinceSent + ' week ago';
        } else {
            return weeksSinceSent + ' weeks ago';
        }
    }
    if (weeksSinceSent < 5) {
        if (weeksSinceSent === 1) {
            return weeksSinceSent + ' week ago';
        } else {
            return weeksSinceSent + ' weeks ago';
        }
    }
    if (monthsSinceSent < 12) {
        if (monthsSinceSent === 1) {
            return monthsSinceSent + ' month ago';
        } else {
            return monthsSinceSent + ' months ago';
        }
    }
    if (yearsSinceSent < 4) {
        if (yearsSinceSent === 1) {
            return yearsSinceSent + ' year ago';
        } else {
            return yearsSinceSent + ' years ago';
        }
    }
}

var dateString = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
var timeString = '';
var amORpm = 'AM';

if (date.getHours() > 12) {
    timeString += (date.getHours() - 12) + ':';
    amORpm = 'PM';
} else {
    timeString += date.getHours() + ':';
}

if (date.getMinutes() < 10) {
    timeString += '0';
}
timeString += date.getMinutes() + ' ' + amORpm;

return dateString + ' ' + timeString;
};

module.exports.parse = parseTime;