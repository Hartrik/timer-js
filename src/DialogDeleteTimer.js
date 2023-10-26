import { Context } from "./Context.js";
import { DataManager } from "./DataManager.js";
import { DomBuilder } from "./DomBuilder.js";

/**
 *
 * @version 2022-03-19
 * @author Patrik Harag
 */
export class DialogDeleteTimer {

    #timer;
    /** @type {Context} */
    #context;
    /** @type {DataManager} */
    #dataManager;

    constructor(context, dataManager, timer) {
        this.#dataManager = dataManager;
        this.#timer = timer;
        this.#context = context;
    }

    show() {
        let dialog = new DomBuilder.BootstrapDialog();
        dialog.setHeaderContent(DomBuilder.element('h2', null, 'Warning'));
        dialog.setBodyContent(DomBuilder.span('Are you sure?'));
        dialog.addCloseButton('Cancel');
        dialog.addButton(DomBuilder.link('Remove', { class: 'btn btn-danger' }, () => {
            this.#dataManager.deleteTimer(this.#timer);
            dialog.hide();
        }));
        dialog.show(this.#context.dialogAnchorNode);
    }
}