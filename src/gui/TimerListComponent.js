import { Controller } from "../Controller";
import { DomBuilder } from "./DomBuilder";
import { Timer } from "../Timer";
import { TimerTableComponent } from "./TimerTableComponent";
import { DialogEditTimer } from "./DialogEditTimer";

import ICON_PLUS from '../../assets/plus-circle.svg'

/**
 *
 * @version 2023-04-10
 * @author Patrik Harag
 */
export class TimerListComponent {

    /** @type {Controller} */
    #controller;

    #nodeTimerList = DomBuilder.div({ class: 'timers-list' });

    /**
     *
     * @param controller {Controller}
     */
    constructor(controller) {
        this.#controller = controller;
    }

    showError(text) {
        this.#nodeTimerList.empty();
        this.#nodeTimerList.append(DomBuilder.span(text));
    }

    /**
     *
     * @param timers {Timer[]}
     */
    updateTimers(timers) {
        this.#nodeTimerList.empty();

        function groupBy(coll, key) {
            return coll.reduce(function(rv, x) {
                (rv[x[key]] = rv[x[key]] || []).push(x);
                return rv;
            }, {});
        }

        let categories = groupBy(timers, 'category');

        let list = Object.entries(categories);
        if (list.length === 0) {
            // empty
        } else if (list.length === 1) {
            // one category
            this.#addList(null, list.pop()[1]);
        } else {
            // more than one category
            list.sort((a, b) => {
                // sort categories - asc by name, null last
                if (a[0] == null || a[0] === '') {
                    return 1;
                }
                if (b[0] == null || b[0] === '') {
                    return -1
                }
                return (a[0] > b[0]) ? 1 : -1;
            })
            .forEach(([key, value]) => {
                let categoryName = (key == null || key === '') ? '...' : key;
                this.#addList(categoryName, value);
            });
        }
    }

    #addList(categoryName, timers) {
        let component = new TimerTableComponent(this.#controller, timers);

        if (categoryName !== null) {
            this.#nodeTimerList.append(DomBuilder.div({ class: 'timers-list-header' }, [
                DomBuilder.element('h2', null, categoryName),
                DomBuilder.link(DomBuilder.create(ICON_PLUS), { class: 'icon' }, (e) => {
                    let defaultTimer = Timer.asTimer({ category: timers[0].category });
                    let dialog = new DialogEditTimer(this.#controller, defaultTimer);
                    dialog.show();
                })
            ]));
        }

        this.#nodeTimerList.append(component.createNode());
    }

    createNode() {
        return this.#nodeTimerList;
    }
}
