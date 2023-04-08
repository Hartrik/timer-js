import { Context } from "./Context.js";
import { DataManager } from "./DataManager.js";
import { DialogDeleteTimer } from "./DialogDeleteTimer.js";
import { DialogEditTimer } from "./DialogEditTimer.js";
import { DomBuilder } from "./DomBuilder.js";
import { Timer } from "./Timer.js";
import { escapeHtml } from "./utils.js";

/**
 *
 * @version 2022-03-19
 * @author Patrik Harag
 */
export class TimerTableComponent {

    /** @type {DomBuilder.BootstrapTable} */
    #tableBuilder;

    /**
     *
     * @param context {Context}
     * @param dataManager {DataManager}
     * @param timers {Timer[]}
     */
    constructor(context, dataManager, timers) {
        this.#tableBuilder = new DomBuilder.BootstrapTable();

        timers.sort((a, b) => {
            // compare remaining time
            let aa = TimerTableComponent.#remainingTimeComparable(a);
            let bb = TimerTableComponent.#remainingTimeComparable(b);
            if (aa > bb) {
                return 1;
            }
            if (aa < bb) {
                return - 1;
            }

            // compare triggered
            aa = TimerTableComponent.#triggeredComparable(a);
            bb = TimerTableComponent.#triggeredComparable(b);
            if (aa > bb) {
                return 1;
            }
            if (aa < bb) {
                return - 1;
            }

            // compare descriptions
            return (a.description !== null ? a.description : '')
                .localeCompare((b.description !== null ? b.description : ''));

        }).forEach(timer => {
            let component = new TimerTableRowComponent(context, dataManager, timer);
            this.#tableBuilder.addRow(component.createNode());
        });
    }

    // allows sorting by remaining time
    static #remainingTimeComparable(timer) {
        if (timer.triggered) {
            if (timer.alertWarn) {
                let duration = moment.duration(moment().diff(moment(timer.triggered)));
                let warnLimitDuration = moment.duration(timer.alertWarn, "days");
                return warnLimitDuration.asMilliseconds() - duration.asMilliseconds();
            } else {
                // no limit -> last
                return Number.MAX_VALUE;
            }
        } else {
            // not triggered yet -> last
            return Number.MAX_VALUE;
        }
    }

    // allows sorting by triggered time
    static #triggeredComparable(timer) {
        if (timer.triggered) {
            return timer.triggered;
        } else {
            // not triggered yet -> last
            return Number.MAX_VALUE;
        }
    }

    createNode() {
        return this.#tableBuilder.createNode();
    }
}

class TimerTableRowComponent {

    /** @type {Context} */
    #context;
    /** @type {DataManager} */
    #dataManager;

    /** @type {Timer} */
    #timer;

    #duration;

    /**
     *
     * @param context {Context}
     * @param dataManager {DataManager}
     * @param timer {Timer}
     */
    constructor(context, dataManager, timer) {
        this.#dataManager = dataManager;
        this.#context = context;
        this.#timer = timer;
    }

    createNode() {
        let duration = null;
        let warnLimitDuration = null;
        if (this.#timer.alertWarn && this.#timer.triggered) {
            duration = moment.duration(moment().diff(moment(this.#timer.triggered)));
            warnLimitDuration = moment.duration(this.#timer.alertWarn, "days");
        }

        let cellLeft = DomBuilder.element('td', { class: 'timer-cell-left' })
            .append(this.#createPartSince())
            .append(this.#createPartAlertProgressBar(duration, warnLimitDuration))
            .append(this.#createPartAlertRemaining(duration, warnLimitDuration));

        let cellMiddle = DomBuilder.element('td', { class: 'timer-cell-middle' })
            .append(DomBuilder.par({ class: 'description' })
                .append(DomBuilder.span(this.#timer.description)))
            .append(this.#createPartAlertProgress(duration));

        [cellLeft, cellMiddle].forEach(e => {
            e.on("click", () => {
                this.#showEditDialog();
            });
        });

        let cellRight = DomBuilder.element('td', { class: 'd-none d-sm-block timer-cell-right' })
            .append(DomBuilder.element('span')
                .append(DomBuilder.link('', { class: 'fa fa-edit' }, (e) => this.#showEditDialog()))
                .append(DomBuilder.link('', { class: 'fa fa-trash' }, (e) => this.#showDeleteDialog())));

        return DomBuilder.element('tr', { class: 'timer-row' })
            .append(cellLeft)
            .append(cellMiddle)
            .append(cellRight);
    }

    #createPartSince() {
        if (this.#timer.triggered) {
            let par = DomBuilder.par({ class: 'since' });

            let starts = moment(this.#timer.triggered);
            let ends = moment();
            let diff = moment.preciseDiff(starts, ends, true);

            function unit(n, unit) {
                let text = n + ' ' + unit;
                if (n !== 1) {
                    text += 's';
                }
                return text;
            }

            if (diff.years) {
                par.append(DomBuilder.span(unit(diff.years, 'year'), { class: 'years-since' }));
            }
            if (diff.months) {
                par.append(DomBuilder.span(unit(diff.months, 'month'), { class: 'months-since' }));
            }
            if (diff.days) {
                par.append(DomBuilder.span(unit(diff.days, 'day'), { class: 'days-since' }));
            }
            if (!diff.years && !diff.months) {
                par.append(DomBuilder.span(unit(diff.hours, 'hour'), { class: 'hours-since' }));
                if (!diff.days) {
                    par.append(DomBuilder.span(unit(diff.minutes, 'minute'), { class: 'minutes-since' }));
                }
            }
            return par;
        }
        return null;
    }

    #createPartAlertProgressBar(duration, warnLimitDuration) {
        if (!this.#timer.alertWarn) {
            // no limit set
            return null;
        }
        if (!this.#timer.triggered) {
            // limit set but not triggered yet
            return null;
        }

        let alertWarnProgress = duration.asMilliseconds() / warnLimitDuration.asMilliseconds();
        let totalHoursRemaining = warnLimitDuration.asHours() - duration.asHours();

        if (totalHoursRemaining > 24) {
            return DomBuilder.div({ class: 'progress' }, [
                DomBuilder.div({
                    class: 'progress-bar progress-bar-striped',
                    role: 'progressbar',
                    style: `width: ${alertWarnProgress * 100}%;`,
                    'aria-valuenow': alertWarnProgress,
                    'aria-valuemin': 0,
                    'aria-valuemax': 1
                })
            ]);
        }

        if (alertWarnProgress < 1) {
            return DomBuilder.div({ class: 'progress' }, [
                DomBuilder.div({
                    class: 'progress-bar progress-bar-striped bg-warning',
                    role: 'progressbar',
                    style: `width: ${alertWarnProgress * 100}%;`,
                    'aria-valuenow': alertWarnProgress,
                    'aria-valuemin': 0,
                    'aria-valuemax': 1
                })
            ]);
        }

        return DomBuilder.div({ class: 'progress' }, [
            DomBuilder.div({
                class: 'progress-bar progress-bar-striped bg-danger progress-bar-animated',
                role: 'progressbar',
                style: `width: 100%;`,
                'aria-valuenow': 1,
                'aria-valuemin': 0,
                'aria-valuemax': 1
            })
        ]);
    }

    #createPartAlertRemaining(duration, warnLimitDuration) {
        if (warnLimitDuration !== null) {
            let totalHoursRemaining = warnLimitDuration.asHours() - duration.asHours();
            if (totalHoursRemaining <= 24) {
                let exceeds = totalHoursRemaining < 0;
                let value = Math.floor(Math.abs(totalHoursRemaining));
                let units = 'hours';
                if (value > 24) {
                    value = Math.floor(value / 24);
                    units = 'days';
                }

                return DomBuilder.par({ class: 'progress-warn-message' }, [
                    DomBuilder.span(`${value} ${units} ${exceeds ? 'exceeding' : 'remaining'}`)
                ]);
            }
        }
        return null;
    }

    #createPartAlertProgress(duration) {
        if (this.#timer.alertWarn) {
            let progress = (this.#timer.triggered)
                ? duration.asDays().toFixed(2)
                : '?';

            return DomBuilder.par({ class: 'limits' }, [
                DomBuilder.span(`Progress: ${ escapeHtml(progress) }/${ escapeHtml(this.#timer.alertWarn) } days`)
            ]);
        }
        return null;
    }

    #showEditDialog() {
        let dialog = new DialogEditTimer(this.#context, this.#dataManager, this.#timer);
        dialog.show();
    }

    #showDeleteDialog() {
        let dialog = new DialogDeleteTimer(this.#context, this.#dataManager, this.#timer);
        dialog.show();
    }
}
