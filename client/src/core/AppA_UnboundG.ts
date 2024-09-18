import {Entity} from "@/Entity";
import {ListA} from "@/core/ListA";

// / unbound means that the created object has no container and no name.
export class AppA_UnboundG {
    
    constructor(private entity : Entity) {
    }

    createList(...jsList : Array<Entity>) : Entity {
        let list = this.entity.appA.createEntityWithApp();
        list.list = new ListA(list, ...jsList);
        return list;
    }

    createText(text: string) : Entity {
        let entity = this.entity.appA.createEntityWithApp();
        entity.text = text;
        return entity;
    }

    createLink(href: string, text?: string) {
        let entity = this.entity.appA.createEntityWithApp();
        entity.link = href;
        entity.text = text;
        return entity;
    }

    createTextWithList(text : string, ...jsList : Array<Entity>) : Entity {
        let entity = this.entity.appA.createEntityWithApp();
        entity.text = text;
        entity.list = new ListA(entity, ...jsList);
        return entity;
    }

    createCollapsible(text: string, ...jsList : Array<Entity>) {
        let entity = this.createTextWithList(text, ...jsList);
        entity.collapsible = true;
        return entity;
    }

    createButton(label : string, func : Function) : Entity {
        let button = this.entity.appA.createEntityWithApp();
        button.text = label;
        button.action = func;
        return button;
    }
}