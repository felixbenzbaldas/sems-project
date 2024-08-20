import {describe, expect, it, test} from "vitest";
import {Identity} from "@/Identity";
import {Starter} from "@/Starter";

let testPort = 8081;
let testServer = 'http://localhost:' + testPort + '/';

/// The local app includes a running local server. These tests need a running test-server.
/// We do not use mocks here, because the local server is seen as part of the application.
describe('local app', () => {

    it('can be loaded', async () => {
        let app : Identity = await Starter.loadLocalhostApp(testPort);

        expect(app.appA_server).toBe(testServer);
    });

    it('can create remote text', async () => {
        let app : Identity = await Starter.loadLocalhostApp(testPort);

        let object = await app.appA_remote_createText('foo');

        expect(object.text).toEqual('foo');
    });

    it('can load text', async () => {
        let name = await createObjectWithText('42');
        let app : Identity = await Starter.loadLocalhostApp(testPort);

        let object = await app.containerAspect_getByName(name);

        expect(object.text).toEqual('42');
    });

    // returns the name of the created object
    async function createObjectWithText(text: string) : Promise<string> {
        let app : Identity = await Starter.loadLocalhostApp(testPort);
        return (await app.appA_remote_createText(text)).name;
    }

});