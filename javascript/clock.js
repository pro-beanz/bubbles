const clock = document.getElementById('clock'),
    hour_10s = document.getElementById('hour_10s'),
    hour_1s = document.getElementById('hour_1s'),
    minute_10s = document.getElementById('minute_10s'),
    minute_1s = document.getElementById('minute_1s'),
    second_10s = document.getElementById('second_10s'),
    second_1s = document.getElementById('second_1s'),
    abbreviation = document.getElementById('abbreviation'),
    day = document.getElementById('day'),
    date = document.getElementById('date'),
    month = document.getElementById('month'),
    year = document.getElementById('year');

let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function Clock() {
    requestAnimationFrame(() => Clock());
    let currentTime = new Date();
    let currentHour = currentTime.getHours(),
        currentMinute = currentTime.getMinutes(),
        currentSecond = currentTime.getSeconds(),
        currentDay = currentTime.getDay(),
        currentDate = currentTime.getDate(),
        currentMonth = currentTime.getMonth(),
        currentYear = currentTime.getFullYear();

    if (currentHour > 12) {
        currentHour -= 12;
        abbreviation.innerHTML = 'PM';
    } else {
        abbreviation.innerHTML = 'AM';
    }
    if (currentHour < 10) {
        currentHour = '0' + currentHour;
    }
    
    if (currentMinute < 10) {
        currentMinute = '0' + currentMinute;
    }
    
    if (currentSecond < 10) {
        currentSecond = '0' + currentSecond;
    }
    
    if (currentDate < 10) {
        currentDate = '0' + currentDate;
    }
    
    hour_10s.innerHTML = Math.floor(currentHour / 10);
    hour_1s.innerHTML = currentHour % 10;
    minute_10s.innerHTML = Math.floor(currentMinute / 10);
    minute_1s.innerHTML = currentMinute % 10;
    second_10s.innerHTML = Math.floor(currentSecond / 10);
    second_1s.innerHTML = currentSecond % 10;
    day.innerHTML = weekdays[currentDay];
    date.innerHTML = currentDate;
    month.innerHTML = months[currentMonth];
    year.innerHTML = currentYear;
}

Clock();