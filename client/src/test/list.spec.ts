import {describe, expect, it, test} from "vitest";
import {Entity} from "@/Entity";
import {Starter} from "@/Starter";

describe('list', () => {

    it('can add object of same container', async () => {
        let app : Entity = Starter.createApp();
        let list : Entity = await app.appA.createList();
        let object : Entity = await app.appA.createText('bar');

        await list.list.addAndUpdateUi(object);

        expect(list.list.jsList.length).toBe(1);
        expect(list.list.jsList.at(0).pathA.listOfNames).toEqual(list.getPath(object).pathA.listOfNames);
    });

    it('can get json (one item)', async () => {
        let app = Starter.createApp();
        let list = await app.appA.createList();
        let item = await app.appA.createText('bar');
        await list.list.addAndUpdateUi(item);

        let json : any = list.json_withoutContainedObjects();

        expect(json.list.length).toBe(1);
        expect(json.list[0]).toEqual(['..', item.name]);
    });

    it('can export (one item)', async () => {
        let app = Starter.createApp();
        let list = await app.appA.createList();
        let item = await app.appA.createText('bar');
        await list.list.addAndUpdateUi(item);

        let exported : any = await list.export_allDependenciesInOneContainer();

        expect(exported.dependencies.length).toBe(1);
        expect(exported.dependencies[0].name).toEqual(item.name);
        expect(exported.dependencies[0].text).toEqual('bar');
    });

});