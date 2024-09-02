import {describe, expect, it, test} from "vitest";
import {Identity} from "@/Identity";
import {Starter} from "@/Starter";
import {wait} from "@/utils";
import {Subject} from "rxjs";


describe('updater', () => {

    it('can update', async () => {
        let app : Identity = Starter.createApp();
        app.appA.logG.toListOfStrings = true;
        app.test_update = () => {
            app.log('test_updated');
        }

        await app.update();

        expect(app.appA.logG.listOfStrings.join()).contains('test_updated');
        expect(app.appA.logG.listOfStrings.join()).contains('gui_updated');
    });

});