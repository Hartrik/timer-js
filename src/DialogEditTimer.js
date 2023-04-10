import { Context } from "./Context.js";
import { DataManager } from "./DataManager.js";
import { DomBuilder } from "./DomBuilder.js";
import { DialogDeleteTimer } from "./DialogDeleteTimer.js";
import { Timer } from "./Timer.js";
import {
    fromIso8601,
    toIso8601DateTime
} from "./utils.js";

import ICON_CALENDAR from '../assets/calendar2-event.svg'
import ICON_CLOCK from '../assets/clock.svg'

/**
 *
 * @version 2022-03-19
 * @author Patrik Harag
 */
export class DialogEditTimer {

    /** @type {Context} */
    #context;
    /** @type {DataManager} */
    #dataManager;

    /** @type {Timer} */
    #timer;
    /** @type {boolean} */
    #createNew;

    constructor(context, dataManager, timer) {
        this.#dataManager = dataManager;
        this.#timer = timer;
        this.#context = context;
        this.#createNew = (timer.id == null)
    }

    show() {
        let form = new TimerForm(this.#timer);

        let dialog = new DomBuilder.BootstrapDialog();
        dialog.setHeaderContent(DomBuilder.element('h2', null, this.#createNew ? 'Create timer' : 'Edit timer'));
        dialog.setBodyContent(form.createNode());
        dialog.addCloseButton('Cancel');
        if (!this.#createNew) {
            dialog.addButton(DomBuilder.link('Remove', { class: 'btn btn-danger' }, () => {
                dialog.hide();
                setTimeout(() => {
                    let deleteDialog = new DialogDeleteTimer(this.#context, this.#dataManager, this.#timer);
                    deleteDialog.show();
                }, 500);
            }));
        }
        dialog.addButton(DomBuilder.link('Ok', { class: 'btn btn-primary btn-ok' }, () => {
            this.#dataManager.putTimer(form.getTimer(), this.#createNew);
            dialog.hide();
        }));
        dialog.show($(this.#context.dialogAnchorSelector));
    }
}

/**
 *
 * @version 2023-04-10
 * @author Patrik Harag
 */
class TimerForm {

    /** @type {Timer} */
    #timer;

    #extractFunctions = [];

    constructor(timer) {
        this.#timer = timer;
    }

    createNode() {
        return DomBuilder.element('form', { class: 'form-vertical' }, [
            DomBuilder.element('fieldset', null, [
                DomBuilder.div({ class: 'form-row col-md-12' }, [
                    DomBuilder.div({ class: 'form-group col-md-12' }, this.#createDescription())
                ]),
                DomBuilder.div({ class: 'form-row col-md-12' }, [
                    DomBuilder.div({ class: 'form-group col-md-12' }, this.#createCategory())
                ]),
                DomBuilder.div({ class: 'form-row col-md-12' }, [
                    DomBuilder.div({ class: 'form-group col-md-12' }, this.#createLimit())
                ]),
                DomBuilder.div({ class: 'form-row col-md-12' }, [
                    DomBuilder.div({ class: 'form-group col-md-12' }, this.#createTriggered())
                ])
            ])
        ]);
    }

    #createDescription() {
        let label = DomBuilder.element('label', null, 'Description')
        let input = DomBuilder.element('input', {
            type: 'text',
            class: 'form-control',
            maxlength: '80',
            value: (this.#timer.description !== null ? this.#timer.description : '')
        });
        this.#extractFunctions.push((t) => t.description = input.val());

        return [label, input];
    }

    #createCategory() {
        let label = DomBuilder.element('label', null, 'Category')
        let input = DomBuilder.element('input', {
            type: 'text',
            class: 'form-control',
            maxlength: '80',
            value: (this.#timer.category !== null ? this.#timer.category : '')
        });
        this.#extractFunctions.push((t) => t.category = input.val());

        return [label, input];
    }

    #createLimit() {
        let label = DomBuilder.element('label', null, 'Limit (days)')
        let input = DomBuilder.element('input', {
            type: 'number', min: '0',
            class: 'form-control',
            maxlength: '80',
            value: (this.#timer.alertWarn !== null ? this.#timer.alertWarn : '')
        });
        this.#extractFunctions.push((t) => t.alertWarn = input.val());

        return [label, input];
    }

    #createTriggered() {
        let label = DomBuilder.element('label', null, 'Last Triggered')
        let input = DomBuilder.element('input', {
            type: 'text',
            class: 'form-control',
            maxlength: '32',
            value: (this.#timer.triggered ? toIso8601DateTime(new Date(this.#timer.triggered)) : '')
        });
        this.#extractFunctions.push((t) => {
            let date = input.val();
            t.triggered = (date !== '') ? fromIso8601(date).valueOf() : null;
        });

        return [
            label,
            input,
            this.#createDateTimeToolbar(input)
        ];
    }

    #createDateTimeToolbar(input) {
        return DomBuilder.div({ class: 'timer-time-toolbar' }, [
            DomBuilder.div({ class: 'timer-time-toolbar-list' }, [
                DomBuilder.div({ class: 'timer-time-toolbar-list-icon' }, [
                    DomBuilder.element('span', { class: 'icon' }, DomBuilder.create(ICON_CALENDAR)),
                    DomBuilder.element('span', { class: 'icon', style: 'margin-left: -0.5em;' }, DomBuilder.create(ICON_CLOCK))
                ]),
                DomBuilder.link('now', { class: 'badge badge-secondary' }, () => input.val(toIso8601DateTime(new Date()))),
                DomBuilder.link('00:00', { class: 'badge badge-secondary' }, () => input.val(toIso8601DateTime(TimerForm.#dateLastH(0)))),
                DomBuilder.link('08:00', { class: 'badge badge-secondary' }, () => input.val(toIso8601DateTime(TimerForm.#dateLastH(8)))),
                DomBuilder.link('12:00', { class: 'badge badge-secondary' }, () => input.val(toIso8601DateTime(TimerForm.#dateLastH(12)))),
                DomBuilder.link('19:00', { class: 'badge badge-secondary' }, () => input.val(toIso8601DateTime(TimerForm.#dateLastH(19)))),
                DomBuilder.link('22:00', { class: 'badge badge-secondary' }, () => input.val(toIso8601DateTime(TimerForm.#dateLastH(22)))),
            ]),
            DomBuilder.div( { class: 'timer-time-toolbar-list' }, [
                DomBuilder.div({ class: 'timer-time-toolbar-list-icon' }, [
                    DomBuilder.element('span', { class: 'icon' }, DomBuilder.create(ICON_CALENDAR)),
                ]),
                DomBuilder.link('-24 h', { class: 'badge badge-secondary' }, () => input.val(TimerForm.#dateAddStr(input.val(), -1, 0))),
                DomBuilder.link('+24 h', { class: 'badge badge-secondary' }, () => input.val(TimerForm.#dateAddStr(input.val(), +1, 0))),
            ]),
            DomBuilder.div( { class: 'timer-time-toolbar-list' }, [
                DomBuilder.div({ class: 'timer-time-toolbar-list-icon' }, [
                    DomBuilder.element('span', { class: 'icon' }, DomBuilder.create(ICON_CLOCK))
                ]),
                DomBuilder.link('-1 h', { class: 'badge badge-secondary' }, () => input.val(TimerForm.#dateAddStr(input.val(), 0, -1))),
                DomBuilder.link('+1 h', { class: 'badge badge-secondary' }, () => input.val(TimerForm.#dateAddStr(input.val(), 0, +1))),
            ])
        ]);
    }

    static #dateLastH(hours) {
        let d = new Date();
        if (hours > d.getHours()) {
            // yesterday
            d.setDate(d.getDate() - 1);
        }
        d.setHours(hours,0,0,0);
        return d;
    }

    static #dateAdd(date, daysToAdd, hoursToAdd) {
        let d = new Date(date);
        if (daysToAdd) {
            d.setDate(d.getDate() + daysToAdd);
        }
        if (hoursToAdd) {
            d.setHours(d.getHours() + hoursToAdd);
        }
        return d;
    }

    static #dateAddStr(strDate, daysToAdd, hoursToAdd) {
        let d = fromIso8601(strDate);
        if (isNaN(d)) {
            // cannot parse date
            return strDate;
        } else {
            return toIso8601DateTime(TimerForm.#dateAdd(d, daysToAdd, hoursToAdd));
        }
    }

    getTimer() {
        this.#extractFunctions.forEach(extractFunction => {
            extractFunction(this.#timer);
        });
        return this.#timer;
    }
}
