import type {Identity} from "@/Identity";
import {devtools} from "vue";

export class LogG {
    toConsole: boolean;
    toListOfStrings: boolean;
    listOfStrings: Array<string> = [];

    constructor(private identity : Identity) {
    }

    log(logger : Identity, log : string) {
        let loggerDescription;
        if (logger.text) {
            loggerDescription = logger.text.substring(0, Math.min(logger.text.length, 20));
        }
        if (this.toListOfStrings) {
            this.listOfStrings.push(loggerDescription + ' /// ' + log);
        }
        if (this.toConsole) { // Note: logging to console could lead to a data leak. You should be careful, when using it.
            if (devtools.enabled) {
                console.log(loggerDescription + ' /// ' + log);
            }
        }
    }
}