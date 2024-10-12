import type {StarterA} from "@/StarterA";
import {UiA} from "@/ui/UiA";
import {Entity} from "@/Entity";
import {websiteData} from "@/website-data";

export class Placeholder {

    impressumHeader = 'marker-dr53hifhh4-impressum-header';
    impressumBody = 'marker-dr53hifhh4-impressum-body';
    website = 'marker-dr53hifhh4-website';

    constructor(public starter : StarterA) {
    }

    async getPlaceholderImpressum() {
        let impressum = await this.getPlaceholder(this.impressumHeader, this.impressumBody);
        impressum.uiA = new UiA(impressum);
        return impressum;
    }

    async getPlaceholder(placeholderHeader : string, placeholderBody : string) : Promise<Entity> {
        let placeholder : Entity;
        if (placeholderBody.startsWith('marker')) {
            placeholder = await this.starter.createdApp.appA.createText('[ to replace during deployment ]');
        } else {
            placeholder = await this.starter.createdApp.appA.createList();
            placeholder.text = placeholderHeader;
            placeholder.collapsible = true;
            await this.starter.createdApp.appA.addAllToListFromRawData(placeholder, JSON.parse(placeholderBody));
        }
        return placeholder;
    }

    getWebsiteData() {
        let created;
        if (this.website.startsWith('marker')) {
            console.log("startsWith marker");
            created = this.starter.createdApp.appA.unboundG.createFromJson(websiteData);
        } else {
            console.log("starts not with marker");
            created = this.starter.createdApp.appA.unboundG.createFromJson(JSON.parse(this.website));
        }
        this.starter.createdApp.containerA.bind(created, 'website');
        return created;
    }
}