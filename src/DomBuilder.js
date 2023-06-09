
/**
 *
 * @version 2023-04-10
 * @author Patrik Harag
 */
export class DomBuilder {

    /**
     *
     * @param html {string}
     * @return {JQuery<HTMLElement>}
     */
    static create(html) {
        return $(html);
    }

    /**
     *
     * @param name {string}
     * @param attributes {object|null}
     * @param content {null|string|JQuery<HTMLElement>|JQuery<HTMLElement>[]}
     * @return {JQuery<HTMLElement>}
     */
    static element(name, attributes = null, content = null) {
        let element = $(`<${name}>`);
        if (attributes !== null) {
            for (let key in attributes) {
                element.attr(key, attributes[key]);
            }
        }
        if (content === null) {
            // nothing
        } else if (typeof content === 'string') {
            element.text(content);
        } else {
            element.append(content);
        }
        return element;
    }

    /**
     *
     * @param attributes {object|null}
     * @param content {null|JQuery<HTMLElement>|JQuery<HTMLElement>[]}
     * @return {JQuery<HTMLElement>}
     */
    static div(attributes = null, content = null) {
        return DomBuilder.element('div', attributes, content);
    }

    /**
     *
     * @param attributes {object|null}
     * @param content {null|string|JQuery<HTMLElement>|JQuery<HTMLElement>[]}
     * @return {JQuery<HTMLElement>}
     */
    static par(attributes = null, content = null) {
        return DomBuilder.element('p', attributes, content);
    }

    /**
     *
     * @param text {string|null}
     * @param attributes {object|null}
     * @return {JQuery<HTMLElement>}
     */
    static span(text = null, attributes = null) {
        return DomBuilder.element('span', attributes, text);
    }

    /**
     *
     * @param text {string}
     * @param attributes {object|null}
     * @param handler {function(e)}
     * @return {JQuery<HTMLElement>}
     */
    static link(text, attributes = null, handler = null) {
        let link = DomBuilder.element('a', attributes, text);
        if (handler !== null) {
            link.attr('href', 'javascript:void(0)');
            link.on("click", handler);
        }
        return link;
    }
}

/**
 *
 * @version 2022-03-20
 * @author Patrik Harag
 */
DomBuilder.Bootstrap = class {

    /**
     *
     * @param node {JQuery<HTMLElement>}
     * @param text {string}
     * @return {JQuery<HTMLElement>}
     */
    static initTooltip(text, node) {
        node.tooltip('dispose');  // remove old one if present

        node.attr('data-toggle', 'tooltip');
        node.attr('data-placement', 'top');
        node.attr('title', text);
        node.tooltip();
        return node;
    }

    /**
     *
     * @param text {string}
     * @param checked {boolean}
     * @param handler {function(boolean)}
     * @return {JQuery<HTMLElement>}
     */
    static switchButton(text, checked, handler = null) {
        let id = 'switch-button_' + Math.floor(Math.random() * 999_999_999);

        let switchInput = DomBuilder.element('input', {
            type: 'checkbox',
            id: id,
            class: 'custom-control-input',
            style: 'width: min-content;'
        });
        if (checked) {
            switchInput.attr('checked', 'true');
        }

        let control = DomBuilder.div({ class: 'custom-control custom-switch' }, [
            switchInput,
            DomBuilder.element('label', { class: 'custom-control-label', for: id }, text)
        ]);

        if (handler !== null) {
            switchInput.on('click', () => {
                let checked = switchInput.prop('checked');
                handler(checked);
            });
        }
        return control;
    }
}

/**
 *
 * @version 2022-03-18
 * @author Patrik Harag
 */
DomBuilder.BootstrapTable = class {

    #tableBody = DomBuilder.element('tbody');

    addRow(row) {
        this.#tableBody.append(row);
    }

    createNode() {
        return DomBuilder.div({ class: 'table-responsive' })
            .append(DomBuilder.element('table', { class: 'table table-striped' })
                .append(this.#tableBody))
    }
}

/**
 *
 * @version 2022-03-18
 * @author Patrik Harag
 */
DomBuilder.BootstrapDialog = class {

    #headerNode = null;
    #bodyNode = null;
    #footerNodeChildren = [];

    #dialog = null;

    setHeaderContent(headerNode) {
        this.#headerNode = headerNode;
    }

    setBodyContent(bodyNode) {
        this.#bodyNode = bodyNode;
    }

    addCloseButton(buttonText) {
        let button = $(`<button type="button" class="btn btn-secondary" data-dismiss="modal"></button>`)
            .text(buttonText);
        this.#footerNodeChildren.push(button)
    }

    addButton(button) {
        this.#footerNodeChildren.push(button);
    }

    show(dialogAnchor) {
        this.#dialog = $(`<div class="modal fade" tabindex="-1" role="dialog" aria-hidden="true"></div>`)
            .append($(`<div class="modal-dialog modal-dialog-centered"></div>`)
                .append($(`<div class="modal-content"></div>`)
                    .append($(`<div class="modal-header"></div>`).append(this.#headerNode))
                    .append($(`<div class="modal-body"></div>`).append(this.#bodyNode))
                    .append($(`<div class="modal-footer"></div>`).append(this.#footerNodeChildren))
                )
            );

        // add into DOM
        dialogAnchor.append(this.#dialog);

        // remove from DOM after hide
        this.#dialog.on('hidden.bs.modal', () => {
            this.#dialog.remove();
        });

        this.#dialog.modal('show');
    }

    hide() {
        if (this.#dialog !== null) {
            this.#dialog.modal('hide');
        }
    }
}
