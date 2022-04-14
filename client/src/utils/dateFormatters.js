function formatStringDateForDatabase(date){
    const splitedDate = date.split("/");
    const formatedDate = splitedDate[0] + "-" + splitedDate[1] + "-" + splitedDate[0];
    return formatedDate;
}

export { formatStringDateForDatabase };