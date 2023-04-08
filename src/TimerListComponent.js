import { Context } from "./Context.js";
import { DataManager } from "./DataManager.js";
import { DomBuilder } from "./DomBuilder.js";
import { Timer } from "./Timer.js";
import { TimerTableComponent } from "./TimerTableComponent.js";
import { DialogEditTimer } from "./DialogEditTimer.js";

/**
 *
 * @version 2022-03-28
 * @author Patrik Harag
 */
export class TimerListComponent {

    /** @type {Context} */
    #context;
    /** @type {DataManager} */
    #dataManager;

    #nodeTimerList = DomBuilder.div({ class: 'timers-list' });

    /**
     *
     * @param context {Context}
     * @param dataManager {DataManager}
     */
    constructor(context, dataManager) {
        this.#context = context;
        this.#dataManager = dataManager;
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
        let component = new TimerTableComponent(this.#context, this.#dataManager, timers);

        if (categoryName !== null) {
            this.#nodeTimerList.append(DomBuilder.div({ class: 'timers-list-header' }, [
                DomBuilder.element('h2', null, categoryName),
                DomBuilder.link('', { class: 'fa fa-plus' }, (e) => {
                    let defaultTimer = Timer.asTimer({ category: timers[0].category });
                    let dialog = new DialogEditTimer(this.#context, this.#dataManager, defaultTimer);
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
