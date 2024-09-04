import {describe, expect, it} from "vitest";
import {Starter} from "@/Starter";
import {Entity} from "@/Entity";

describe('object', () => {
    it('can get path of other object in same container', async () => {
        let app = Starter.createApp();
        let object = await app.appA.createText('foo');
        let otherObject = await app.appA.createText('bar');

        let path : Entity = object.getPath(otherObject);

        expect(path.pathA.listOfNames).toEqual(['..', otherObject.name]);
    });

    it('can resolve path of other object in same container', async () => {
        let app : Entity = Starter.createApp();
        let object : Entity = await app.appA.createText('bar');
        let otherObject : Entity = await app.appA.createText('foo');
        let pathOfOther : Entity = object.getPath(otherObject);

        let resolved : Entity = await object.resolve(pathOfOther);

        expect(resolved).toBe(otherObject);
    });
});