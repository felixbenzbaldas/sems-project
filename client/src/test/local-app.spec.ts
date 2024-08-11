import {describe, expect, it} from "vitest";
import {Identity} from "@/Identity";
import {Starter} from "@/Starter";

let testServer = 'http://localhost:8081/';

/// The local app includes a running local server. These tests need a running test-server.
/// We do not use mocks here, because the local server is seen as part of the application.
describe('local app', () => {

    it('can create remote text', async () => {
        let app : Identity = Starter.loadRemoteApp(testServer);

        let object = await app.remote_createText('foo');

        expect(object.text).toEqual('foo');
    });

});