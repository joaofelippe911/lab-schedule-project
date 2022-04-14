
function getFirstDayOfTheWeek(date){

  let currentDateSplited = date.toLocaleDateString('pt-br', {
    year: "numeric",
    month: '2-digit',
    day: '2-digit',
  }).split("/");

  let dayOfMonth = date.getDate();

  let currentDayOfWeek = date.getDay();
  if(dayOfMonth >= 7) {
    const firstDayOfTheWeek = dayOfMonth - currentDayOfWeek;
    return (currentDateSplited[2] + '-' + currentDateSplited[1] + '-' + (('0' + (firstDayOfTheWeek)).slice(-2)));
  } else {
    const d = (currentDateSplited[1] - 1) <= 0 ? new Date((currentDateSplited[2] - 1), "12", 0) : new Date(currentDateSplited[2], (currentDateSplited[1] - 1), 0);
    
    const previousMonthNumOfDays = d.getDate();
    if((dayOfMonth - currentDayOfWeek) < 0){
      const firstDayOfTheWeek = previousMonthNumOfDays + (dayOfMonth - currentDayOfWeek);
      return (d.getFullYear() + "-" + (("0" + (d.getMonth() + 1)).slice(-2)) + "-" + firstDayOfTheWeek); 
    } else {
      const firstDayOfTheWeek = dayOfMonth - currentDayOfWeek;
      return (currentDateSplited[2] + "-" + currentDateSplited[1] + "-" + (("0" + firstDayOfTheWeek).slice(-2)));
    }
  }

}

function getLastDayOfTheWeek(date){
  let currentDateSplited = date.toLocaleDateString('pt-br', {
    year: "numeric",
    month: '2-digit',
    day: '2-digit',
  }).split("/");

  let currentMonthNumOfDays = new Date(currentDateSplited[2], currentDateSplited[1], 0).getDate();
  let dayOfMonth = date.getDate();
  let currentDayOfWeek = date.getDay();

  if(dayOfMonth <= (currentMonthNumOfDays - 6)){
    const lastDayOfTheWeek = dayOfMonth.valueOf() + (6 - currentDayOfWeek);
    return (currentDateSplited[2] + '-' + currentDateSplited[1] + '-' + ('0' + (lastDayOfTheWeek)).slice(-2));
  } else {
    const lastDayOfTheWeek = (6 - currentDayOfWeek) - (currentMonthNumOfDays - dayOfMonth);
    if(lastDayOfTheWeek == 0){
      return (currentDateSplited[2] + '-' + currentDateSplited[1] + '-' + ('0' + (currentMonthNumOfDays)).slice(-2));
    } else if((date.getMonth() + 1) == 12){
      return ((parseInt(currentDateSplited[2]) + 1) + '-01-' + ('0' + (lastDayOfTheWeek)).slice(-2));
    } else {
      return (currentDateSplited[2] + '-' + currentDateSplited[1] + '-' + ('0' + (lastDayOfTheWeek)).slice(-2));
    }
  }
}

module.exports = { getFirstDayOfTheWeek, getLastDayOfTheWeek }