import {describe, expect, it, test} from "vitest";
import {Entity} from "@/Entity";
import {StarterA} from "@/StarterA";

describe('list', () => {

    it('can export (one item)', async () => {
        let app = StarterA.createApp();
        let list = await app.appA.createList();
        let item = await app.appA.createText('bar');
        await list.listA.add(item);

        let exported : any = await list.export_allDependenciesInOneContainer();

        expect(exported.dependencies.length).toBe(1);
        expect(exported.dependencies[0].name).toEqual(item.name);
        expect(exported.dependencies[0].text).toEqual('bar');
    });

});