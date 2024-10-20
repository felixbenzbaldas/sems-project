import {Entity} from "@/Entity";

export class PathA {

    listOfNames : Array<string>

    constructor(listOfNames : Array<string>) {
        this.listOfNames = listOfNames;
    }

    withoutFirst() {
        let entity = new Entity();
        entity.pathA = new PathA(this.listOfNames.slice(1, this.listOfNames.length));
        return entity;
    }
}