import { Context } from "../Context.js";
import { Persistence } from "../Persistence.js";
import { Timer } from "../Timer.js";
import $ from "jquery";

/**
 *
 * @version 2022-03-28
 * @author Patrik Harag
 */
export class PersistenceForPrivateUse extends Persistence {

    #context;

    /**
     *
     * @param context {Context}
     */
    constructor(context) {
        super();
        this.#context = context;
    }

    isSavingEnabled() {
        return true;
    }

    getTimers() {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: '/app/timer/private/data',
                type: 'GET',
                dataType: 'text',
                success: (data) => {
                    let timers;
                    try {
                        timers = Timer.parseTimers(data);
                    } catch (e) {
                        reject(e);
                        return;
                    }
                    resolve(timers);
                },
                error: reject
            });
        });
    }

    putTimer(timer) {
        let createNew = (timer.id === null);
        let ajaxUrl = createNew ? `/app/timer/private/data` : `/app/timer/private/data/${timer.id}`;
        let ajaxType = createNew ? 'POST' : 'PUT';

        let dataToSend = Object.assign({}, timer);
        dataToSend[this.#context.csrfParameterName] = this.#context.csrfToken;

        return new Promise((resolve, reject) => {
            $.ajax({
                url: ajaxUrl,
                type: ajaxType,
                data: JSON.stringify(dataToSend),
                contentType: 'application/json',
                dataType: 'json',
                success: resolve,
                error: reject
            });
        });
    }

    deleteTimer(timer) {
        let csrfKey = encodeURIComponent(this.#context.csrfParameterName);
        let csrfValue = encodeURIComponent(this.#context.csrfToken);
        let url = `/app/timer/private/data/${ timer.id }?${ csrfKey }=${ csrfValue }`;

        // note: it just does not work with data parameter

        return new Promise((resolve, reject) => {
            $.ajax({
                url: url,
                type: 'DELETE',
                success: resolve,
                error: reject
            });
        });
    }
}
