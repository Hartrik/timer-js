import {Timer} from "./Timer";

/**
 *
 * @version 2023-11-02
 * @author Patrik Harag
 */
export class Persistence {

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