import type {Entity} from "@/Entity";
import {notNullUndefined} from "@/utils";

export class CreateFromOldFormat {

    houseName : string;

    constructor(public entity : Entity) {
    }

    async run(json: any) : Promise<Entity> {
        let entity : Entity = this.entity.appA.createEntityWithApp();
        entity.installContainerA();
        entity.installListA();
        this.houseName = this.splitPathString(json.rootObject)[0];
        for (let jsonObject of json.objects) {
            let name =  this.splitPathString(jsonObject.id)[1];
            let current : Entity = await entity.containerA.createBoundEntity(name);
            let properties = jsonObject.properties;
            current.text = properties.text;
            if (properties.context) {
                current.context = this.createPath(current, properties.context);
            }
            if (notNullUndefined(properties.defaultExpanded)) {
                current.collapsible = !properties.defaultExpanded;
            }
            if (jsonObject.details) {
                current.installListA();
                for (let detail of jsonObject.details) {
                    current.listA.jsList.push(this.createPath(current, detail));
                }
            }
        }
        entity.listA.jsList.push(this.entity.appA.createPath([
            this.splitPathString(json.rootObject)[1]]));
        return entity;
    }

    splitPathString(oldPath : string) : Array<string> {
        return oldPath.split('-');
    }

    createPath(object : Entity, oldPath : string) : Entity {
        let splitted = this.splitPathString(oldPath);
        if (this.houseName === splitted[0]) {
            return this.entity.appA.createPath(['..', splitted[1]]);
        } else {
            return this.entity.appA.createPath(['..', '..', splitted[0], splitted[1]]);
        }
    }
}