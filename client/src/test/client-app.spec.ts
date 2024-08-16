import {describe, expect, it} from "vitest";
import {Identity} from "@/Identity";
import {Starter} from "@/Starter";


describe('client app', () => {

    it('can get json', async () => {
        let app : Identity = Starter.createAppWithUI();

        let json = app.json();

        expect(json.content.list).toEqual([]);
    });

});