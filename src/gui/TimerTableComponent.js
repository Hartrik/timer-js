import { Controller } from "../Controller";
import { DomBuilder } from "./DomBuilder";
import { Timer } from "../Timer";
import { TimerTableRowComponent } from "./TimerTableRowComponent";
import moment from 'moment';
import 'moment-precise-range-plugin';

/**
 *
 * @version 2023-11-16
 * @author Patrik Harag
 */
export class TimerTableComponent {

    /** @type {DomBuilder.BootstrapTable} */
    #tableBuilder;

    /**
     *
     * @param controller {Controller}
     * @param timers {Timer[]}
     */
    constructor(controller, timers) {
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
            let component = new TimerTableRowComponent(controller, timer);
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