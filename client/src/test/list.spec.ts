import {describe, expect, it, test} from "vitest";
import {Identity} from "@/Identity";
import {Starter} from "@/Starter";

describe('list', () => {

    it('can add object of same container', async () => {
        let app : Identity = Starter.createApp();
        let list : Identity = await app.appA.createList();
        let object : Identity = await app.appA.createText('bar');

        list.list.add(object);

        expect(list.list.jsList.length).toBe(1);
        expect(list.list.jsList.at(0).pathA.listOfNames).toEqual(list.getPath(object).pathA.listOfNames);
    });

    it('can get json (one item)', async () => {
        let app = Starter.createApp();
        let list = await app.appA.createList();
        let item = await app.appA.createText('bar');
        list.list.add(item);

        let json : any = list.json();

        expect(json.list.length).toBe(1);
        expect(json.list[0]).toEqual(['..', item.name]);
    });

    it('can export (one item)', async () => {
        let app = Starter.createApp();
        let list = await app.appA.createList();
        let item = await app.appA.createText('bar');
        list.list.add(item);

        let exported : any = await list.export();

        expect(exported.dependencies).toBeTruthy();
        expect(exported.dependencies[0].name).toEqual(item.name);
        expect(exported.dependencies[0].text).toEqual('bar');
    });

    test('can add all from raw data (empty)', async () => {
        let app = Starter.createApp();
        let list = await app.appA.createList();
        let rawData : any = {list:[]};

        await app.appA.addAllToListFromRawData(list, rawData);

        expect(list.list.jsList.length).toBe(0);
    });

    test('can add all from raw data (one item)', async () => {
        let app = Starter.createApp();
        let list = await app.appA.createList();
        let rawData : any = {
            list:[['..','0']],
            dependencies:[
                {
                    name: '0',
                    text:'new item'
                }
            ]
        };

        await app.appA.addAllToListFromRawData(list, rawData);

        expect(list.list.jsList.length).toBe(1);
        expect((await list.resolve(list.list.jsList.at(0))).text).toEqual('new item');
    });
});