
/**
 *
 * @version 2022-03-17
 * @author Patrik Harag
 */
export class Context {

    dialogAnchorSelector;

    csrfParameterName;
    csrfToken;

    timeZoneOffset;

    constructor(dialogAnchorSelector, csrfParameterName, csrfToken) {
        this.dialogAnchorSelector = dialogAnchorSelector;
        this.csrfParameterName = csrfParameterName;
        this.csrfToken = csrfToken;
        this.timeZoneOffset = new Date().getTimezoneOffset();
    }
}
