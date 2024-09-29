import {describe, expect, it} from "vitest";
import {Entity} from "@/Entity";
import {Starter} from "@/Starter";

describe('simple list', () => {
    
    it('can add entity', async () => {
        let app : Entity = Starter.createApp();
        let list : Entity = app.appA.unboundG.createList();

        await list.list.add(app.appA.createEntityWithApp());

        expect(list.list.jsList.length).toBe(1);
    });

    it('can get json (empty)', async () => {
        let app : Entity = Starter.createApp();
        let list : Entity = app.appA.unboundG.createList();

        let json = list.json_withoutContainedObjects();

        expect(json.list).toEqual([]);
    });

    it('can get description', async () => {
        let app : Entity = Starter.createApp();
        let list : Entity = app.appA.unboundG.createList();
        await list.list.add(app.appA.createEntityWithApp());

        let description = list.getDescription();

        expect(description).toEqual('list (1)');
    });
});