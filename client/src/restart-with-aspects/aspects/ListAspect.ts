import type {Identity} from "@/restart-with-aspects/Identity";

export class ListAspect {

    private list : Array<Identity> = [];

    getLength() : number {
        return this.list.length;
    }

    addIdentity(object: Identity) {
        this.list.push(object);
    }
}