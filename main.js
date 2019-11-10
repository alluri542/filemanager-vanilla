import { FileManager } from './filemanager.js';

let selector = "p";
let filemanager = new FileManager(selector);

fetch("./data.json")
    .then(response => response.json())
    .then((data) => {
        let filemanager = new FileManager(selector);
        filemanager.build({
            files: data.GridData,
            actions: data.Actions,
            headers: ["Name", "Type", "Description", "ModifiedDate", "Actions"]
        });
    })
