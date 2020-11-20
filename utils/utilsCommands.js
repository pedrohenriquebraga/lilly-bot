module.exports = {
  secondsToMs(second) {
    return second * 1000;
  },

  generateDate(hour = false) {
    const date = new Date();

    let day = date.getDate();
    day <= 9 ? (day = "0" + day) : day;

    let month = date.getMonth() + 1;
    month <= 9 ? (month = "0" + month) : month;

    let year = date.getFullYear();

    let formattedDate = `${day}/${month}/${year}`;

    if (hour) {
      let hour = date.getHours();
      hour <= 9 ? (hour = "0" + hour) : hour;

      let minutes = date.getMinutes();
      minutes <= 9 ? (minutes = "0" + minutes) : minutes;

      formattedDate += `-${hour}:${minutes}`;
    }

    return formattedDate;
  },
};
