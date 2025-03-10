import type {Entity} from "@/Entity";
import {UiA_AppA} from "@/ui/UiA_AppA";

export class AppA_ProfileG {

    private lastRemovedString : string = 'lastRemoved';
    private contentString : string = 'content';
    rootString : string = 'root';

    constructor(public entity : Entity) {
    }

    getProfile() : Entity {
        return this.entity.containerA.mapNameEntity.get('profile');
    }

    setProfile(profile: Entity) {
        this.entity.containerA.bind(profile, 'profile');
    }

    async createProfile() {
        let profile = this.entity.appA.unboundG.createText('profile');
        profile.installListA();
        profile.installContainerA();
        let lastRemovedList = await profile.containerA.createList();
        await profile.set(this.lastRemovedString, lastRemovedList);
        let contentList = await profile.containerA.createList();
        await profile.set(this.contentString, contentList);
        await this.setProfile(profile);
    }

    async addToLastRemoved(entity: Entity) {
        let profile = this.getProfile();
        if (profile) {
            let lastRemoved = await profile.get(this.lastRemovedString);
            await lastRemoved.listA.add(entity);
            await lastRemoved.uis_update();
        } else {
            console.error('no profile!');
        }
    }

    async clearLastRemoved() {
        let profile = this.getProfile();
        let lastRemoved = await profile.get(this.lastRemovedString);
        lastRemoved.listA.jsList = [];
        await lastRemoved.uis_update();
    }

    async exportProfile() : Promise<any> {
        let profile = this.getProfile();
        let forContent = await profile.get(this.contentString);
        forContent.listA.jsList = [];
        let content = this.entity.appA.uiA.mainColumnData;
        for (let resolved of await content.listA.getResolvedList()) {
            await forContent.listA.add(resolved);
        }
        return await profile.export();
    }

    async importProfile(json : any) {
        let created = this.entity.appA.unboundG.createFromJson(json);
        this.setProfile(created);
        let forContent = await created.get(this.contentString);
        for (let resolved of await forContent.listA.getResolvedList()) {
            await this.entity.appA.uiA.mainColumnData.listA.add(resolved);
        }
        await this.entity.appA.uiA.mainColumnData.uis_update();
        forContent.listA.jsList = [];
    }
}