import $ from "jquery";

/**
 *
 * @version 2023-11-16
 * @author Patrik Harag
 */
export class FileUtils {

    static download(content, defaultFilename, contentType) {
        // create a blob
        let blob = new Blob([content], {type: contentType});
        let url = URL.createObjectURL(blob);

        // create a link to download it
        let pom = document.createElement('a');
        pom.href = url;
        pom.setAttribute('download', defaultFilename);
        pom.click();
    }

    static downloadJSON(content, defaultFilename) {
        FileUtils.download(content, defaultFilename, 'application/json;charset=utf-8;')
    }

    static uploadFileAsText(fileHandler) {
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
}