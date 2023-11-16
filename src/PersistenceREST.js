import { Persistence } from "./Persistence";
import { Timer } from "./Timer";
import $ from "jquery";

/**
 *
 * @version 2023-11-16
 * @author Patrik Harag
 */
export class PersistenceREST extends Persistence {

    #urlBase;

    #csrfParameterName;
    #csrfToken;

    constructor(urlBase, csrfParameterName, csrfToken) {
        super();
        this.#urlBase = urlBase;
        this.#csrfParameterName = csrfParameterName;
        this.#csrfToken = csrfToken;
    }

    isSavingEnabled() {
        return true;
    }

    getTimers() {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: this.#urlBase,
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
        let ajaxUrl = createNew ? this.#urlBase : this.#urlBase + '/' + timer.id;
        let ajaxType = createNew ? 'POST' : 'PUT';

        let dataToSend = Object.assign({}, timer);
        dataToSend[this.#csrfParameterName] = this.#csrfToken;

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
        let csrfKey = encodeURIComponent(this.#csrfParameterName);
        let csrfValue = encodeURIComponent(this.#csrfToken);
        let url = `${ this.#urlBase }/${ timer.id }?${ csrfKey }=${ csrfValue }`;

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
