import {describe, expect, it, test} from "vitest";
import {Identity} from "@/Identity";
import {Starter} from "@/Starter";

let testPort = 8081;
let testServer = 'http://localhost:' + testPort + '/';

/// The local app includes a running local server. These tests need a running test-server.
/// We do not use mocks here, because the local server is seen as part of the application.
describe('local app', () => {

    it('can be loaded', async () => {
        let app : Identity = await Starter.loadLocalhostApp(testServer);

        expect(app.server).toBe(testServer);
    });

    it('can create remote text', async () => {
        let app : Identity = await Starter.loadLocalhostApp(testServer);

        let object = await app.remote_createText('foo');

        expect(object.text).toEqual('foo');
    });

});