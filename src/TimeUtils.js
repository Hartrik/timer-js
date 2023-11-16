
/**
 *
 * @version 2023-11-16
 * @author Patrik Harag
 */
export class TimeUtils {

    static toIso8601Date(date) {
        let dd = String(date.getDate()).padStart(2, '0');
        let mm = String(date.getMonth() + 1).padStart(2, '0');  // January is 0!
        let yyyy = date.getFullYear();
        return yyyy + '-' + mm + '-' + dd;
    }

    static toIso8601Time(date) {
        let hh = String(date.getHours()).padStart(2, '0');
        let mm = String(date.getMinutes()).padStart(2, '0');
        return hh + ':' + mm
    }

    static toIso8601DateTime(date) {
        return TimeUtils.toIso8601Date(date) + ' ' + TimeUtils.toIso8601Time(date);
    }

    static fromIso8601(strDate) {
        return new Date(Date.parse(strDate));
    }
}