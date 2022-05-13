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
      currentDateSplited[2] +
      "-" +
      currentDateSplited[1] +
      "-" +
      ("0" + firstDayOfTheWeek).slice(-2);
  } else {
    let d = new Date(currentDateSplited[2], currentDateSplited[1] - 1, 0);
    let previousMonthNumOfDays = d.getDate();
    firstDayOfTheWeek =
      previousMonthNumOfDays + (dayOfMonth - currentDayOfWeek);

    if (currentDateSplited[1] != 1) {
      firstDayOfTheWeek =
        currentDateSplited[2] +
        "-" +
        ("0" + (currentDateSplited[1] - 1)).slice(-2) +
        "-" +
        ("0" + firstDayOfTheWeek).slice(-2);
    } else {
      firstDayOfTheWeek =
        currentDateSplited[2] -
        1 +
        "-12-" +
        ("0" + firstDayOfTheWeek).slice(-2);
    }
  }

  if (dayOfMonth <= currentMonthNumOfDays - 7) {
    lastDayOfTheWeek = dayOfMonth.valueOf() + (6 - currentDayOfWeek);
    lastDayOfTheWeek =
      currentDateSplited[2] +
      "-" +
      currentDateSplited[1] +
      "-" +
      ("0" + lastDayOfTheWeek).slice(-2);
  } else {
    lastDayOfTheWeek =
      6 - currentDayOfWeek - (currentMonthNumOfDays - dayOfMonth);
    if (lastDayOfTheWeek === 0) {
      lastDayOfTheWeek = currentMonthNumOfDays;
      lastDayOfTheWeek =
        currentDateSplited[2] +
        "-" +
        ("0" + (date.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + lastDayOfTheWeek).slice(-2);
    } else if (date.getMonth() === 11) {
      lastDayOfTheWeek =
        parseInt(currentDateSplited[2]) +
        1 +
        "-01-" +
        ("0" + lastDayOfTheWeek).slice(-2);
    } else {
      lastDayOfTheWeek =
        currentDateSplited[2] +
        "-" +
        ("0" + (date.getMonth() + 2)).slice(-2) +
        "-" +
        ("0" + lastDayOfTheWeek).slice(-2);
    }
  }

  return { firstDayOfTheWeek, lastDayOfTheWeek };
}

module.exports = { getFirstAndLastDayOfTheWeek };