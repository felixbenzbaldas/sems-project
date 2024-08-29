import type {Identity} from "@/Identity";

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
        if (this.toConsole) { // TODO Security
            console.log(loggerDescription + ' /// ' + log);
        }
    }
}