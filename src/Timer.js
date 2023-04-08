
/**
 *
 * @version 2022-03-28
 * @author Patrik Harag
 */
export class Timer {

    /** @type {number|null} */
    id = null;

    /** @type {string|null} */
    description = null;

    /** @type {string|null} */
    category = null;

    /** @type {number|null} */
    alertWarn = null;

    /** @type {string|null} */
    triggered = null;


    static asTimer(object) {
        let timer = new Timer();
        if (object.id !== undefined) {
            timer.id = object.id;
        }
        if (object.description !== undefined) {
            timer.description = object.description;
        }
        if (object.category !== undefined) {
            timer.category = object.category;
        }
        if (object.alertWarn !== undefined) {
            timer.alertWarn = object.alertWarn;
        }
        if (object.triggered !== undefined) {
            timer.triggered = object.triggered;
        }
        return timer;
    }

    /**
     * @param jsonString {string}
     * @returns {Timer[]}
     */
    static parseTimers(jsonString) {
        let parsed = JSON.parse(jsonString);
        let timers = [];
        for (let i = 0; i < parsed.length; i++) {
            timers.push(Timer.asTimer(parsed[i]))
        }
        return timers;
    }
}
