import {Timer} from "../Timer";
import {Examples} from "./Examples";
import {Persistence} from "../Persistence";

/**
 *
 * @version 2023-11-02
 * @author Patrik Harag
 */
export class PersistenceLocalStorage extends Persistence {
    static TIMERS_DATA_KEY = 'timer.timers.data';

    #savingEnabled = null;
    #timers = null;

    constructor() {
        super();
    }

    isSavingEnabled() {
        if (this.#savingEnabled === null) {
            let data = window.localStorage.getItem(PersistenceLocalStorage.TIMERS_DATA_KEY);
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
            let data = window.localStorage.getItem(PersistenceLocalStorage.TIMERS_DATA_KEY);
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
            window.localStorage.setItem(PersistenceLocalStorage.TIMERS_DATA_KEY, value);
        }
    }

    #discardTimers() {
        if (window.localStorage) {
            window.localStorage.removeItem(PersistenceLocalStorage.TIMERS_DATA_KEY);
        }
    }
}