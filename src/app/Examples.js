import {Timer} from "../Timer";

/**
 *
 * @version 2022-03-28
 * @author Patrik Harag
 */
export class Examples {

    /**
     *
     * @returns {Timer[]}
     */
    static exampleTimers() {
        let currentId = 0;

        return [
            // #housing

            Timer.asTimer({
                id: currentId++,
                description: 'Watering flowers',
                category: '#housing',
                alertWarn: 7,
                triggered: Examples.#date(12, '15:27')
            }),
            Timer.asTimer({
                id: currentId++,
                description: 'Supplies check',
                category: '#housing',
                alertWarn: 60,
                triggered: Examples.#date(56, '22:30')
            }),
            Timer.asTimer({
                id: currentId++,
                description: 'Do the hoovering',
                category: '#housing',
                alertWarn: 7,
                triggered: Examples.#date(6, '05:00')
            }),
            Timer.asTimer({
                id: currentId++,
                description: 'Mop the floors',
                category: '#housing',
                alertWarn: 7,
                triggered: Examples.#date(3, '23:00')
            }),
            Timer.asTimer({
                id: currentId++,
                description: 'Clean the windows',
                category: '#housing',
                alertWarn: 180,
                triggered: ''
            }),

            // _anniversary
            Timer.asTimer({
                id: currentId++,
                description: 'Born',
                category: '_anniversary',
                alertWarn: null,
                triggered: Examples.#date(3000 + 25 * 365, '12:00')
            }),
            Timer.asTimer({
                id: currentId++,
                description: 'University graduation',
                category: '_anniversary',
                alertWarn: null,
                triggered: Examples.#date(3000, '12:00')
            }),
            Timer.asTimer({
                id: currentId++,
                description: 'Samsung Galaxy A52',
                category: '_anniversary',
                alertWarn: null,
                triggered: Examples.#date(240, '17:30')
            }),
            Timer.asTimer({
                id: currentId++,
                description: 'Living in Pilsen',
                category: '_anniversary',
                alertWarn: null,
                triggered: Examples.#date(5000, '12:00')
            }),
            Timer.asTimer({
                id: currentId++,
                description: 'Audi A4',
                category: '_anniversary',
                alertWarn: null,
                triggered: Examples.#date(630, '12:00')
            })
        ]
    }

    static #date(dateMinus, time) {
        let dateOffset = (24 * 60 * 60 * 1000) * dateMinus;
        let date = new Date();
        date.setTime(date.getTime() - dateOffset);  // approx...
        date.setHours(parseInt(time.substr(0, 2)));
        date.setMinutes(parseInt(time.substr(3, 2)));
        return date.valueOf();
    }
}