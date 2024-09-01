import type {Identity} from "@/Identity";

export class ListA {

    jsList : Array<Identity>;

    constructor(private identity : Identity, ...jsList : Array<Identity>) {
        this.jsList = jsList;
    }

    add(...items : Array<Identity>) {
        items.forEach(item => {
           if (item.name && item.container) {
               this.jsList.push(this.identity.getPath(item));
           } else {
               this.jsList.push(item);
           }
        });
        this.identity.update();
    }

    json() {
        return this.jsList.map(identity => {
            if (identity.pathA) {
                return identity.pathA.listOfNames;
            } else {
                return identity.json();
            }
        });
    }

    async getObject(index : number) : Promise<Identity> {
        return this.identity.resolve(this.jsList.at(index));
    }
}