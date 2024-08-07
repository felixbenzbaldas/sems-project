import type {Path} from "@/deprecated/core/Path";
import type {SemsObject} from "@/deprecated/core/SemsObject";
import type {Location} from "@/deprecated/core/Location";
import {Subject, Subscription} from "rxjs";

export class ListProperty {

    private subject : Subject<string> = new Subject<string>();

    constructor(private location : Location, private object : SemsObject, private name : string, private list : Array<Path>) {
    }

    length() : number {
        return this.list.length;
    }

    async addItem(path: Path) : Promise<void> {
        let newList : Array<Path> = [...this.list]; // copy
        newList.push(path);
        let pathOfObject = this.location.getPath(this.object);
        await this.location.request('set',
            [pathOfObject.toList(), this.name, newList.map(p => p.toList())]);
        this.list.push(path);
        this.subject.next('addedItem');
    }

    getItem(index: number) : Path {
        return this.list.at(index);
    }

    async removeAllItems() {
        let pathOfObject = this.location.getPath(this.object);
        await this.location.request('set',
            [pathOfObject.toList(), this.name, []]);
        this.list = [];
        this.subject.next('cleared');
    }

    subscribe(next: (value: string) => void) : Subscription {
        return this.subject.subscribe(next);
    }
}