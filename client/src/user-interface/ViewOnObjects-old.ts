import type {ListProperty} from "@/core/ListProperty";
import type {Path} from "@/core/Path";
import {Subject, Subscription} from "rxjs";
import {SemsObject} from "@/core/SemsObject";
import type {Location} from "@/core/Location";

export class ViewOnObjectsOld {

    private objects = Array<SemsObject>();
    private subject : Subject<string> = new Subject<string>();

    /// do not forget to load!
    constructor(private location : Location, private listProperty : ListProperty) {
    }

    async load() {
        await this.update();
        this.listProperty.subscribe(async event => {
            this.objects = [];
            await this.update();
            this.subject.next(event);
        });
    }

    subscribe(next: (value: string) => void) : Subscription {
        return this.subject.subscribe(next);
    }

    getLength() : number {
        return this.objects.length;
    }

    getItem(index: number) : SemsObject {
        return this.objects.at(index);
    }

    async update() {
        for (let i = 0; i < this.listProperty.length(); i++) {
            let path : Path = this.listProperty.getItem(i);
            let object = await this.location.getObject(path);
            this.objects.push(object);
        }
    }
}