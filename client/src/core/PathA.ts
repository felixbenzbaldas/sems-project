import {Identity} from "@/Identity";

export class PathA {

    listOfNames : Array<string>

    constructor(listOfNames : Array<string>) {
        this.listOfNames = listOfNames;
    }

    withoutFirst() {
        let identity = new Identity();
        identity.pathA = new PathA(this.listOfNames.slice(1, this.listOfNames.length));
        return identity;
    }
}