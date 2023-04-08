import { Timer } from "./Timer.js";

/**
 *
 * @version 2022-03-22
 * @author Patrik Harag
 */
export class Persistence {

    static createForPublicUse() {
        return new PersistenceForPublicUse();
    }

    isSavingEnabled() {
        throw 'Unsupported operation: not implemented';
    }

    setSavingEnabled(savingEnabled) {
        throw 'Unsupported operation: not implemented';
    }

    /**
     * @returns {Promise<Timer[]>}
     */
    getTimers() {
        throw 'Unsupported operation: not implemented';
    }

    /**
     * @param timer {Timer}
     * @returns {Promise}
     */
    putTimer(timer) {
        throw 'Unsupported operation: not implemented';
    }

    /**
     * @param timer {Timer}
     * @returns {Promise}
     */
    deleteTimer(timer) {
        throw 'Unsupported operation: not implemented';
    }
}

/**
 *
 * @version 2022-03-28
 * @author Patrik Harag
 */
class PersistenceForPublicUse extends Persistence {
    static TIMERS_DATA_KEY = 'timer.timers.data';

    #savingEnabled = null;
    #timers = null;

    constructor() {
        super();
    }

    isSavingEnabled() {
        if (this.#savingEnabled === null) {
            let data = window.localStorage.getItem(PersistenceForPublicUse.TIMERS_DATA_KEY);
            this.#savingEnabled = (data !== null);
        }
        return this.#savingEnabled;
    }

    setSavingEnabled(savingEnabled) {
        if (savingEnabled) {
            if (this.#timers !== null) {
                this.#storeTimers();
            }
        } else {
            this.#discardTimers();
        }
        this.#savingEnabled = savingEnabled;
    }

    getTimers() {
        // working data
        if (this.#timers !== null) {
            return new Promise((resolve, reject) => {
                resolve(this.#timers);
            });
        }

        // saved data
        if (window.localStorage) {
            let data = window.localStorage.getItem(PersistenceForPublicUse.TIMERS_DATA_KEY);
            if (data !== null) {
                return new Promise((resolve, reject) => {
                    let timers;
                    try {
                        timers = Timer.parseTimers(data);
                    } catch (e) {
                        this.#timers = [];
                        reject(e);
                        return;
                    }
                    this.#timers = timers;
                    resolve(timers);
                });
            }
        }

        // example data
        return new Promise((resolve, reject) => {
            this.#timers = Examples.exampleTimers();
            resolve(this.#timers);
        });
    }

    putTimer(timer) {
        return new Promise((resolve, reject) => {
            if (timer.id !== null) {
                let added = false;
                for (let i = 0; i < this.#timers.length; i++) {
                    if (this.#timers[i].id === timer.id) {
                        this.#timers[i] = timer;
                        added = true;
                        break
                    }
                }
                if (!added) {
                    this.#timers.push(timer);
                }
            } else {
                timer.id = Date.now();
                this.#timers.push(timer);
            }

            if (this.isSavingEnabled()) {
                this.#storeTimers();
            }

            resolve(true);
        });
    }

    deleteTimer(timer) {
        return new Promise((resolve, reject) => {
            this.#timers = this.#timers.filter(t => t.id !== timer.id);
            if (this.isSavingEnabled()) {
                this.#storeTimers();
            }
            resolve(true);
        });
    }

    #storeTimers() {
        if (window.localStorage) {
            let value = JSON.stringify(this.#timers);
            window.localStorage.setItem(PersistenceForPublicUse.TIMERS_DATA_KEY, value);
        }
    }

    #discardTimers() {
        if (window.localStorage) {
            window.localStorage.removeItem(PersistenceForPublicUse.TIMERS_DATA_KEY);
        }
    }
}

/**
 *
 * @version 2022-03-28
 * @author Patrik Harag
 */
class Examples {

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
                triggered: Examples.#date(3000 + 25*365, '12:00')
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
        let dateOffset = (24*60*60*1000) * dateMinus;
        let date = new Date();
        date.setTime(date.getTime() - dateOffset);  // approx...
        date.setHours(parseInt(time.substr(0, 2)));
        date.setMinutes(parseInt(time.substr(3, 2)));
        return date.valueOf();
    }
}
