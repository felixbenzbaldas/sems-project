import {describe, expect, it} from "vitest";
import {Identity} from "@/Identity";
import {Starter} from "@/Starter";

describe('simple list', () => {
    
    it('can add identity', async () => {
        let app : Identity = Starter.createApp();
        let list : Identity = app.appA.simple_createList();

        list.list.add(app.appA.createIdentityWithApp());

        expect(list.list.jsList.length).toBe(1);
    });

    it('can get json (empty)', async () => {
        let app : Identity = Starter.createApp();
        let list : Identity = app.appA.simple_createList();

        let json = list.json();

        expect(json.list).toEqual([]);
    });

    it('can get description', async () => {
        let app : Identity = Starter.createApp();
        let list : Identity = app.appA.simple_createList();
        list.list.add(app.appA.createIdentityWithApp());

        let description = list.getDescription();

        expect(description).toEqual('list (1)');
    });
});