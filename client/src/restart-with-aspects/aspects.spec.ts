import {describe, expect, it, test} from "vitest";
import {Identity} from "@/restart-with-aspects/Identity";
import {Starter} from "@/restart-with-aspects/Starter";

describe('app', () => {

    it('can be created', async () => {
        let app : Identity = Starter.createApp();

        expect(app.text).toEqual('Sems application');
    });

    it('can create an identity', async () => {
        let app : Identity = Starter.createApp();

        let identity : Identity = app.createIdentity();

        expect(identity).toBeTruthy();
    });

    it('can set text', async () => {
        let app : Identity = Starter.createApp();

        app.text = 'my application';

        expect(app.text).toBe('my application');
    });

    it('can create a list', async () => {
        let app : Identity = Starter.createApp();

        let list : Identity = app.createList();

        expect(list.list.getLength()).toBe(0);
    });

    test('can add identity to list', async () => {
        let app : Identity = Starter.createApp();
        let list : Identity = app.createList();

        list.list.addIdentity(app.createIdentity());

        expect(list.list.getLength()).toBe(1);
    });
});