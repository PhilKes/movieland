import moment from "moment";

export function dateToString(date) {
    return moment(date).format("YYYY-MM-DD");
}
