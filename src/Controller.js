import { Timer } from "./Timer";
import { Persistence } from "./Persistence";
import { Analytics } from "./Analytics";

/**
 *
 * @version 2023-11-16
 * @author Patrik Harag
 */
export class Controller {

    /** @type {jQuery<HTMLElement>} */
    #dialogAnchorNode;
    /** @type {Persistence} */
    #persistence;
    /** @type {function(Timer[])[]} */
    #onUpdateHandlers = [];
    /** @type {function(any)[]} */
    #onUpdateFailedHandlers = [];

    /**
     *
     * @param dialogAnchorNode
     * @param persistence {Persistence}
     */
    constructor(dialogAnchorNode, persistence) {
        this.#persistence = persistence;
        this.#dialogAnchorNode = dialogAnchorNode;

        this.addOnUpdateFailedHandler(e => {
            console.log(e);
        });
    }

    getDialogAnchor() {
        return this.#dialogAnchorNode;
    }

    addOnUpdateHandler(handler) {
        this.#onUpdateHandlers.push(handler);
    }

    addOnUpdateFailedHandler(handler) {
        this.#onUpdateFailedHandlers.push(handler);
    }

    getPersistence() {
        return this.#persistence;
    }

    /**
     *
     * @param timer {Timer}
     * @param createNew {boolean|undefined}
     */
    putTimer(timer, createNew) {
        this.#persistence.putTimer(timer).then(value => {
            if (createNew !== undefined) {
                Analytics.triggerFeatureUsed(createNew ? Analytics.FEATURE_TIMER_CREATED : Analytics.FEATURE_TIMER_UPDATED);
            }
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
            Analytics.triggerFeatureUsed(Analytics.FEATURE_TIMER_DELETED);
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
                    this.putTimer(timers[i], undefined);
                }
            } else {
                throw 'Array expected';
            }
        } catch (e) {
            console.log(e);
        }
    }

    reload() {
        this.#persistence.getTimers().then(timers => {
            for (let handler of this.#onUpdateHandlers) {
                handler(timers);
            }
        }).catch(reason => {
            for (let handler of this.#onUpdateFailedHandlers) {
                handler(reason);
            }
        });
    }
}