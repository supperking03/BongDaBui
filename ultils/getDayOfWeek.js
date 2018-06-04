const weekday = new Array(7);
weekday[0] =  "Chủ nhật";
weekday[1] = "Thứ 2";
weekday[2] = "Thứ 3";
weekday[3] = "Thứ 4";
weekday[4] = "Thứ 5";
weekday[5] = "Thứ 6";
weekday[6] = "Thứ 7";


export function getDayOfWeek(dateString){
    if (dateString===null || dateString=== undefined)
        return "";
    let dateArray=dateString.split("/");
    const date=new Date(dateArray[2],dateArray[1],dateArray[0]);
    return weekday[date.getDay()];
}