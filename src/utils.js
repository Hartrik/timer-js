
import $ from "jquery";

/**
 *
 * @version 2022-03-26
 * @author Patrik Harag
 */

export function toIso8601Date(date) {
    let dd = String(date.getDate()).padStart(2, '0');
    let mm = String(date.getMonth() + 1).padStart(2, '0');  // January is 0!
    let yyyy = date.getFullYear();
    return yyyy + '-' + mm + '-' + dd;
}

export function toIso8601Time(date) {
    let hh = String(date.getHours()).padStart(2, '0');
    let mm = String(date.getMinutes()).padStart(2, '0');
    return hh + ':' + mm
}

export function toIso8601DateTime(date) {
    return toIso8601Date(date) + ' ' + toIso8601Time(date);
}

export function fromIso8601(strDate) {
    return new Date(Date.parse(strDate));
}

export function escapeHtml(input) {
    let map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    let text = '' + input;
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

function download(content, defaultFilename, contentType) {
    // create a blob
    let blob = new Blob([content], { type: contentType });
    let url = URL.createObjectURL(blob);

    // create a link to download it
    let pom = document.createElement('a');
    pom.href = url;
    pom.setAttribute('download', defaultFilename);
    pom.click();
}

export function downloadJSON(content, defaultFilename) {
    download(content, defaultFilename, 'application/json;charset=utf-8;')
}

export function uploadFileAsText(fileHandler) {
    let fileDialog = $('<input type="file">');
    fileDialog.trigger('click');
    fileDialog.on('change', (e) => {
        let files = e.target.files;
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            let reader = new FileReader();
            reader.onload = (e) => {
                fileHandler(file.name, e.target.result);
            }
            reader.readAsText(file);
        }
    });
}
