import {describe, expect, it} from "vitest";
import {Entity} from "@/Entity";
import {StarterA} from "@/StarterA";

describe('simple list', () => {
    
    it('can add entity', async () => {
        let app : Entity = StarterA.createApp();
        let list : Entity = app.appA.unboundG.createList();

        await list.listA.add(app.appA.createEntityWithApp());

        expect(list.listA.jsList.length).toBe(1);
    });

    it('can get json (empty)', async () => {
        let app : Entity = StarterA.createApp();
        let list : Entity = app.appA.unboundG.createList();

        let json = list.json_withoutContainedObjects();

        expect(json.list).toEqual([]);
    });

    it('can get description', async () => {
        let app : Entity = StarterA.createApp();
        let list : Entity = app.appA.unboundG.createList();
        await list.listA.add(app.appA.createEntityWithApp());

        let description = list.getDescription();

        expect(description).toEqual('list (1)');
    });
});