import {Http} from "@/core/Http";
import {configuration} from "@/core/configuration";
import type {Location} from "@/core/Location";

export class RemoteObject {

    private container: any;

    constructor(private location : Location, private name : string, private text : string) {
    }

    getName() : string {
        return this.name;
    }

    getText() : string {
        return this.text;
    }

    async setText(text: string) : Promise<void> {
        let path = this.location.getPath(this);
        return this.location.request('setText', [path.toList(), text]).then(() => {
            this.text = text;
        });
    }

    setContainer(container : any) {
        this.container = container;
    }

    getContainer() : any {
        return this.container;
    }
}