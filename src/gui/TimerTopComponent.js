import { Controller } from "../Controller";
import { DomBuilder } from "./DomBuilder";
import { DialogEditTimer } from "./DialogEditTimer";
import { TimerListComponent } from "./TimerListComponent";
import { Timer } from "../Timer";
import { Analytics } from "../Analytics";
import { TimeUtils } from "../TimeUtils";
import { FileUtils } from "../FileUtils";

/**
 *
 * @version 2023-11-16
 * @author Patrik Harag
 */
export class TimerTopComponent {

    /** @type {Controller} */
    #controller;

    /** @type {TimerListComponent} */
    #timerListComponent;

    #enableSaveSwitch = true;

    #nodeRefresh = DomBuilder.button('Refresh', { class: 'btn btn-sm btn-secondary' }, () => this.refresh());

    /**
     *
     * @param controller {Controller}
     */
    constructor(controller) {
        this.#controller = controller;
        this.#timerListComponent = new TimerListComponent(this.#controller);

        this.#controller.addOnUpdateHandler(timers => {
            let date = new Date();
            this.#timerListComponent.updateTimers(timers);
            DomBuilder.Bootstrap.initTooltip('Refreshed: ' + TimeUtils.toIso8601DateTime(date), this.#nodeRefresh);
            Analytics.triggerFeatureUsed(Analytics.FEATURE_APP_INITIALIZED);
        })
        this.#controller.addOnUpdateFailedHandler(e => {
            this.#timerListComponent.showError('Error loading timers');
        })
    }

    disableSaveSwitch() {
        this.#enableSaveSwitch = false;
    }

    createNode() {
        return DomBuilder.div({ class: 'timer-component' }, [
            DomBuilder.div({ class: 'timers-toolbar' }, [
                DomBuilder.button('Add', { class: 'btn btn-sm btn-secondary' }, e => {
                    let dialog = new DialogEditTimer(this.#controller, new Timer());
                    dialog.show();
                }),
                this.#nodeRefresh,
                DomBuilder.button('Export', { class: 'btn btn-sm btn-light' }, e => {
                    this.#controller.exportAsJSON(timers => {
                        FileUtils.downloadJSON(timers, `timers_${ TimeUtils.toIso8601Date(new Date()) }.json`);
                    });
                }),
                DomBuilder.button('Import', { class: 'btn btn-sm btn-light' }, e => {
                    FileUtils.uploadFileAsText((name, content) => {
                        this.#controller.importFromJSON(content);
                    });
                }),
                (this.#enableSaveSwitch ? this.#createSaveSwitch() : null)
            ]),
            this.#timerListComponent.createNode()
        ]);
    }

    #createSaveSwitch() {
        let persistence = this.#controller.getPersistence();
        return DomBuilder.Bootstrap.initTooltip('Store into browser storage (local storage)',
            DomBuilder.Bootstrap.switchButton('Save', persistence.isSavingEnabled(), (enabled) => {
                persistence.setSavingEnabled(enabled)
            })
        )
    }

    refresh() {
        this.#controller.reload();
    }

    enablePeriodicalRefresh(minutes) {
        let interval = 1000 * 60 * minutes;  // ms
        setInterval(() => this.refresh(), interval);
    }
}
