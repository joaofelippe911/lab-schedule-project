function getFirstAndLastDayOfTheWeek() {
  const date = new Date();

  let currentDateSplited = date
    .toLocaleDateString("pt-br", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .split("/");

  let currentMonthNumOfDays = new Date(
    currentDateSplited[2],
    currentDateSplited[1],
    0
  ).getDate();

  let dayOfMonth = parseInt(currentDateSplited[0]);
  let firstDayOfTheWeek;
  let lastDayOfTheWeek;

  let currentDayOfWeek = new Date().getDay();

  if (dayOfMonth - currentDayOfWeek > 0) {
    firstDayOfTheWeek = dayOfMonth - currentDayOfWeek;
    firstDayOfTheWeek =
      ("0" + firstDayOfTheWeek).slice(-2) +
      "-" +
      currentDateSplited[1] +
      "-" +
      currentDateSplited[2];
  } else {
    let d = new Date(currentDateSplited[2], currentDateSplited[1] - 1, 0);
    let previousMonthNumOfDays = d.getDate();
    firstDayOfTheWeek =
      previousMonthNumOfDays + (dayOfMonth - currentDayOfWeek);

    if (currentDateSplited[1] != 1) {
      firstDayOfTheWeek =
        ("0" + firstDayOfTheWeek).slice(-2) +
        "-" +
        ("0" + (currentDateSplited[1] - 1)).slice(-2) +
        "-" +
        currentDateSplited[2];
    } else {
      firstDayOfTheWeek =
        ("0" + firstDayOfTheWeek).slice(-2) +
        "-12-" +
        (currentDateSplited[2] - 1);
    }
  }

  if (dayOfMonth <= currentMonthNumOfDays - 7) {
    lastDayOfTheWeek = dayOfMonth.valueOf() + (6 - currentDayOfWeek);
    lastDayOfTheWeek =
      ("0" + lastDayOfTheWeek).slice(-2) +
      "-" +
      currentDateSplited[1] +
      "-" +
      currentDateSplited[2];
  } else {
    lastDayOfTheWeek =
      6 - currentDayOfWeek - (currentMonthNumOfDays - dayOfMonth);
    if (lastDayOfTheWeek === 0) {
      lastDayOfTheWeek = currentMonthNumOfDays;
      lastDayOfTheWeek =
        ("0" + lastDayOfTheWeek).slice(-2) +
        "-" +
        ("0" + (date.getMonth() + 1)).slice(-2) +
        "-" +
        currentDateSplited[2];
    } else if (date.getMonth() === 11) {
      lastDayOfTheWeek =
        ("0" + lastDayOfTheWeek).slice(-2) +
        "-01-" +
        (parseInt(currentDateSplited[2]) + 1);
    } else {
      lastDayOfTheWeek =
        ("0" + lastDayOfTheWeek).slice(-2) +
        "-" +
        ("0" + (date.getMonth() + 2)).slice(-2) +
        "-" +
        currentDateSplited[2];
    }
  }

  return { firstDayOfTheWeek, lastDayOfTheWeek };
}

function getFirstAndLastDayOfTheMonth() {
  const date = new Date();
  const currentDateSplited = date
    .toLocaleDateString("pt-br", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .split("/");

  const month = currentDateSplited[1];

  let lastDay = new Date(currentDateSplited[2], month, 0);
  lastDay = lastDay.getDate();
  const firstDayOfTheMonth = "01-" + month + "-" + currentDateSplited[2];
  const lastDayOfTheMonth = lastDay + "-" + month + "-" + currentDateSplited[2];

  return { firstDayOfTheMonth, lastDayOfTheMonth };
}

function getFirstAndLastDayOfTheYear() {
  const year = new Date().getFullYear();

  const firstDayOfTheYear = "01-01-" + year;
  const lastDayOfTheYear = "31-12-" + year;

  return { firstDayOfTheYear, lastDayOfTheYear };
}

export {
  getFirstAndLastDayOfTheWeek,
  getFirstAndLastDayOfTheMonth,
  getFirstAndLastDayOfTheYear,
};
