import {describe, expect, it} from "vitest";
import {Identity} from "@/Identity";
import {Starter} from "@/Starter";

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

        expect(list.list.jsList.length).toBe(0);
    });

    it('can add identity to list', async () => {
        let app : Identity = Starter.createApp();
        let list : Identity = app.createList();

        list.list.add(app.createIdentity());

        expect(list.list.jsList.length).toBe(1);
    });

    it('can get json', async () => {
        let app : Identity = Starter.createApp();
        app.text = 'my app';

        let json = app.json();

        expect(json.text).toEqual('my app');
    });

    it('can get json of list', async () => {
        let app : Identity = Starter.createApp();
        let list : Identity = app.createList();

        let json = list.json();

        expect(json.list).toEqual([]);
    });
});