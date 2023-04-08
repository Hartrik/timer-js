import { Context } from "./Context.js";
import { Timer } from "./Timer.js";
import { Persistence } from "./Persistence.js";

/**
 *
 * @version 2022-03-26
 * @author Patrik Harag
 */
export class DataManager {

    /** @type {Context} */
    #context;
    /** @type {Persistence} */
    #persistence;
    /** @type {function(Promise)} */
    #updateFunction;

    /**
     *
     * @param context {Context}
     * @param updateFunction {function(Promise)}
     * @param persistence {Persistence}
     */
    constructor(context, persistence, updateFunction) {
        this.#persistence = persistence;
        this.#context = context;
        this.#updateFunction = updateFunction;
    }

    /**
     *
     * @param timer {Timer}
     */
    putTimer(timer) {
        this.#persistence.putTimer(timer).then(value => {
            this.reload();
        }).catch(reason => {
            console.log(reason);
        })
    }

    /**
     *
     * @param timer {Timer}
     */
    deleteTimer(timer) {
        this.#persistence.deleteTimer(timer).then(value => {
            this.reload();
        }).catch(reason => {
            console.log(reason);
        })
    }

    exportAsJSON(handler) {
        this.#persistence.getTimers().then(timers => {
            handler(JSON.stringify(timers, null, 4));
        })
    }

    importFromJSON(textContent) {
        try {
            let timers = Timer.parseTimers(textContent);
            if (Array.isArray(timers)) {
                for (let i = 0; i < timers.length; i++) {
                    this.putTimer(timers[i]);
                }
            } else {
                throw 'Array expected';
            }
        } catch (e) {
            console.log(e);
        }
    }

    reload() {
        this.#updateFunction(this.#persistence.getTimers());
    }
}