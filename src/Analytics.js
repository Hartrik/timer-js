/**
 *
 * @version 2023-04-08
 * @author Patrik Harag
 */
export class Analytics {

    static EVENT_NAME = 'app_timer_js';
    static FEATURE_APP_INITIALIZED = 'initialized';
    static FEATURE_TIMER_CREATED = 'timer-created';
    static FEATURE_TIMER_UPDATED = 'timer-updated';
    static FEATURE_TIMER_DELETED = 'timer-deleted';

    static #USED_FEATURES = new Set();

    static triggerFeatureUsed(feature) {
        if (!Analytics.#USED_FEATURES.has(feature)) {
            // report only the first use
            Analytics.#USED_FEATURES.add(feature);
            Analytics.#report({
                'app_timer_js_feature': feature
            });
        }
    }

    static #report(properties) {
        if (typeof gtag === 'function') {
            gtag('event', Analytics.EVENT_NAME, properties);
        }
        // console.log('event: ' + Analytics.EVENT_NAME + ' = ' + JSON.stringify(properties));
    }
}
