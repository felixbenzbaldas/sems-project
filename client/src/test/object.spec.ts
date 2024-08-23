import {describe, expect, it} from "vitest";
import {Starter} from "@/Starter";
import {Identity} from "@/Identity";

describe('object', () => {
    it('can get path of other object in same container', async () => {
        let app = Starter.createApp();
        let object = await app.appA.createText('foo');
        let otherObject = await app.appA.createText('bar');

        let path : Identity = object.getPath(otherObject);

        expect(path.pathA.listOfNames).toEqual(['..', otherObject.name]);
    });

    it('can resolve path of other object in same container', async () => {
        let app : Identity = Starter.createApp();
        let object : Identity = await app.appA.createText('bar');
        let otherObject : Identity = await app.appA.createText('foo');
        let pathOfOther : Identity = object.getPath(otherObject);

        let resolved : Identity = await object.resolve(pathOfOther);

        expect(resolved).toBe(otherObject);
    });
});