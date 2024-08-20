import type {Identity} from "@/Identity";

export class ListAspect {

    jsList : Array<Identity>;

    constructor(private identity : Identity, ...jsList : Array<Identity>) {
        this.jsList = jsList;
    }

    add(...items : Array<Identity>) {
        // TODO: only add path (if possible)
        this.jsList.push(...items);
        this.identity.notify();
    }

    json() {
        return this.jsList.map(identity => 'a list item (todo: calculate path)');
    }
}