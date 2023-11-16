import { Controller } from "../Controller";
import { DomBuilder } from "./DomBuilder";

/**
 *
 * @version 2023-11-16
 * @author Patrik Harag
 */
export class DialogDeleteTimer {

    /** @type {Timer} */
    #timer;
    /** @type {Controller} */
    #controller;

    constructor(controller, timer) {
        this.#controller = controller;
        this.#timer = timer;
    }

    show() {
        let dialog = new DomBuilder.BootstrapDialog();
        dialog.setHeaderContent('Warning');
        dialog.setBodyContent(DomBuilder.span('Are you sure?'));
        dialog.addCloseButton('Cancel');
        dialog.addButton(DomBuilder.link('Remove', { class: 'btn btn-danger' }, () => {
            this.#controller.deleteTimer(this.#timer);
            dialog.hide();
        }));
        dialog.show(this.#controller.getDialogAnchor());
    }
}