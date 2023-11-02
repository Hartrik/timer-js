
import { Context } from "../Context.js";
import { TimerTopComponent } from "../TimerTopComponent.js";
import { PersistenceREST } from "./PersistenceREST.js";
import { DomBuilder } from "../DomBuilder.js";

export function builder() {
    return new Builder();
}

/**
 *
 * @version 2023-10-30
 * @author Patrik Harag
 */
class Builder {

    #csrfParameterName;
    #csrfToken;

    setCsrf(csrfParameterName, csrfToken) {
        this.#csrfParameterName = csrfParameterName;
        this.#csrfToken = csrfToken;
        return this;
    }

    build() {
        if (!this.#csrfParameterName) {
            throw 'CSRF parameter name not set';
        }
        if (!this.#csrfToken) {
            throw 'CSRF token not set';
        }

        const dialogAnchorNode = DomBuilder.div({ class: 'timer-dialog-anchor' });
        document.body.prepend(dialogAnchorNode[0]);

        const context = new Context(dialogAnchorNode, this.#csrfParameterName, this.#csrfToken);
        const persistence = new PersistenceREST(context);
        const component = new TimerTopComponent(context, persistence);
        component.disableSaveSwitch();
        component.enablePeriodicalRefresh(5);
        setTimeout(() => component.refresh());

        const node = component.createNode();
        return node[0];
    }
}