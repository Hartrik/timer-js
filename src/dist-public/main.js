
import { Context } from "../Context.js";
import { Persistence } from "../Persistence.js";
import { TimerTopComponent } from "../TimerTopComponent.js";

export function builder() {
    return new Builder();
}

/**
 *
 * @version 2023-04-08
 * @author Patrik Harag
 */
class Builder {

    #dialogAnchorSelector;
    #csrfParameterName;
    #csrfToken;

    setDialogAnchor(dialogAnchorSelector) {
        this.#dialogAnchorSelector = dialogAnchorSelector;
        return this;
    }

    setCsrf(csrfParameterName, csrfToken) {
        this.#csrfParameterName = csrfParameterName;
        this.#csrfToken = csrfToken;
        return this;
    }

    build() {
        if (!this.#dialogAnchorSelector) {
            throw 'Dialog anchor not set';
        }
        if (!this.#csrfParameterName) {
            throw 'CSRF parameter name not set';
        }
        if (!this.#csrfToken) {
            throw 'CSRF token not set';
        }

        let context = new Context($(this.#dialogAnchorSelector), this.#csrfParameterName, this.#csrfToken);
        let persistence = Persistence.createForPublicUse();
        let component = new TimerTopComponent(context, persistence);
        component.enablePeriodicalRefresh(3);
        setTimeout(() => component.refresh());

        return component.createNode();
    }
}