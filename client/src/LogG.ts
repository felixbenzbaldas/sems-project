import type {Entity} from "@/Entity";
import {devtools} from "vue";

export class LogG {
    toConsole: boolean; // Note: logging to console could lead to a data leak. You should be careful, when using it.
    toListOfStrings: boolean;
    listOfStrings: Array<string> = [];

    constructor(private entity : Entity) {
    }

    log(logger : Entity, log : string) {
        if (this.toListOfStrings || this.toConsole) {
            let shortDescription = logger.getShortDescription();
            if (this.toListOfStrings) {
                this.listOfStrings.push(shortDescription + ' /// ' + log);
            }
            if (this.toConsole) {
                console.log(shortDescription + ' /// ' + log);
            }
        } else {
            if (location?.hostname == 'localhost') { // Note: logging to console could lead to a data leak. You should be careful, when using it.
                console.log(logger.getShortDescription() + ' /// ' + log);
            }
        }
    }
}