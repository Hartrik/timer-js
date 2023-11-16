
import { TimerTopComponent } from "../gui/TimerTopComponent";
import { PersistenceREST } from "../PersistenceREST";
import { DomBuilder } from "../gui/DomBuilder";
import { PersistenceLocalStorage } from "../PersistenceLocalStorage";
import { Examples } from "./Examples";
import { Controller } from "../Controller";

export function builder() {
    return new Builder();
}

/**
 *
 * @version 2023-11-16
 * @author Patrik Harag
 */
class Builder {

    #persistence;

    setPersistenceHttp(urlBase, csrfParameterName, csrfToken) {
        if (urlBase === undefined) {
            throw 'Url base not set';
        }
        if (csrfParameterName === undefined) {
            throw 'CSRF parameter name not set';
        }
        if (csrfToken === undefined) {
            throw 'CSRF token not set';
        }

        this.#persistence = new PersistenceREST(urlBase, csrfParameterName, csrfToken);
        return this;
    }

    setPersistenceLocalStorage() {
        this.#persistence = new PersistenceLocalStorage(Examples.exampleTimers());
        return this;
    }

    build() {
        const dialogAnchorNode = DomBuilder.div({ class: 'timer-dialog-anchor' });
        document.body.prepend(dialogAnchorNode[0]);

        const controller = new Controller(dialogAnchorNode, this.#persistence);
        const component = new TimerTopComponent(controller);
        if (this.#persistence instanceof PersistenceREST) {
            component.disableSaveSwitch();
        }
        component.enablePeriodicalRefresh(3);
        setTimeout(() => component.refresh());

        const node = component.createNode();
        return node[0];
    }
}