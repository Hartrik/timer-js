import { Context } from "./Context.js";
import { Persistence } from "./Persistence.js";
import { DataManager } from "./DataManager.js";
import { DomBuilder } from "./DomBuilder.js";
import { DialogEditTimer } from "./DialogEditTimer.js";
import { TimerListComponent } from "./TimerListComponent.js";
import { Timer } from "./Timer.js";
import { Analytics } from "./Analytics.js";
import {
    toIso8601DateTime,
    toIso8601Date,
    downloadJSON,
    uploadFileAsText
} from "./utils.js";

/**
 *
 * @version 2022-03-26
 * @author Patrik Harag
 */
export class TimerTopComponent {

    /** @type {Context} */
    #context;
    /** @type {Persistence} */
    #persistence;
    /** @type {DataManager} */
    #dataManager;

    /** @type {TimerListComponent} */
    #timerListComponent;

    #enableSaveSwitch = true;

    #nodeRefresh = DomBuilder.link('Refresh', { class: 'badge badge-secondary' }, () => this.refresh());

    /**
     *
     * @param context {Context}
     * @param persistence {Persistence}
     */
    constructor(context, persistence) {
        this.#context = context;
        this.#persistence = persistence;
        this.#dataManager = new DataManager(context, persistence, (p) => this.#onUpdateTimers(p));
        this.#timerListComponent = new TimerListComponent(context, this.#dataManager);
    }

    #onUpdateTimers(promise) {
        promise.then(timers => {
            let date = new Date();
            this.#timerListComponent.updateTimers(timers);
            DomBuilder.Bootstrap.initTooltip('Refreshed: ' + toIso8601DateTime(date), this.#nodeRefresh);
            Analytics.triggerFeatureUsed(Analytics.FEATURE_APP_INITIALIZED);
        }).catch(reason => {
            console.log(reason);
            this.#timerListComponent.showError('Error loading timers');
        });
    }

    disableSaveSwitch() {
        this.#enableSaveSwitch = false;
    }

    createNode() {
        return DomBuilder.div({ class: 'timer-component' }, [
            DomBuilder.div({ class: 'timers-toolbar' }, [
                DomBuilder.link('Create Timer', { class: 'badge badge-secondary' }, e => {
                    let dialog = new DialogEditTimer(this.#context, this.#dataManager, new Timer());
                    dialog.show();
                }),
                this.#nodeRefresh,
                (this.#enableSaveSwitch ? this.#createSaveSwitch() : null),
                DomBuilder.link('Export', { class: 'badge badge-light' }, e => {
                    this.#dataManager.exportAsJSON(timers => {
                        downloadJSON(timers, `timers_${ toIso8601Date(new Date()) }.json`);
                    });
                }),
                DomBuilder.link('Import', { class: 'badge badge-light' }, e => {
                    uploadFileAsText((name, content) => {
                        this.#dataManager.importFromJSON(content);
                    });
                }),
            ]),
            this.#timerListComponent.createNode()
        ]);
    }

    #createSaveSwitch() {
        return DomBuilder.Bootstrap.initTooltip('Store into browser storage (local storage)',
            DomBuilder.Bootstrap.switchButton('Save', this.#persistence.isSavingEnabled(), (enabled) => {
                this.#persistence.setSavingEnabled(enabled)
            })
        )
    }

    refresh() {
        this.#dataManager.reload();
    }

    enablePeriodicalRefresh(minutes) {
        let interval = 1000 * 60 * minutes;  // ms
        setInterval(() => this.refresh(), interval);
    }
}
