import type {Identity} from "@/Identity";

export class ListAspect {

    jsList : Array<Identity>;

    constructor(private identity : Identity, ...jsList : Array<Identity>) {
        this.jsList = jsList;
    }

    add(...items : Array<Identity>) {
        this.jsList.push(...items);
        this.identity.subject.next('addedItems');
    }
}