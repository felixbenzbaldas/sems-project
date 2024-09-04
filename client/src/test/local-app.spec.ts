import {describe, expect, it, test} from "vitest";
import {Entity} from "@/Entity";
import {Starter} from "@/Starter";

let testPort = 8081;
let testServer = 'http://localhost:' + testPort + '/';

/// The local app includes a running local server. These tests need a running test-server.
/// We do not use mocks here, because the local server is seen as part of the application.
describe('local app', () => {

    it('can be loaded', async () => {
        let app : Entity = await Starter.loadLocalhostApp(testPort);

        expect(app.appA.server).toBe(testServer);
    });

    it('can create remote text', async () => {
        let app : Entity = await Starter.loadLocalhostApp(testPort);

        let object = await app.appA.createText('foo');

        expect(object.text).toEqual('foo');
    });

    it('can load text', async () => {
        let name = await createObjectWithText('42');
        let app : Entity = await Starter.loadLocalhostApp(testPort);

        let object = await app.containerA.getByName(name);

        expect(object.text).toEqual('42');
    });

    // returns the name of the created object
    async function createObjectWithText(text: string) : Promise<string> {
        let app : Entity = await Starter.loadLocalhostApp(testPort);
        return (await app.appA.createText(text)).name;
    }

});