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

    it('updates sequentially', async () => {
        let app : Identity = Starter.createApp();
        let resolve : () => void;
        app.appA.logG.toListOfStrings = true;
        app.appA.logG.toConsole = true;
        app.test_update = async () => {
            let blocker = app.appA.getBlocker();
            resolve = blocker.resolve;
            await blocker.block();
            app.log('test_updated 1');
        };
        app.update();
        await wait(10);
        app.test_update = async () => {
            let blocker = app.appA.getBlocker();
            resolve = blocker.resolve;
            await blocker.block();
            app.log('test_updated 2');
        };
        app.update();
        await wait(10);
        resolve();
        await wait(10);
        expect(app.appA.logG.listOfStrings.join()).contains('test_updated 1');
        expect(app.appA.logG.listOfStrings.join()).not.contains('test_updated 2');
        resolve();
        await wait(10);
        expect(app.appA.logG.listOfStrings.join()).contains('test_updated 2');
    });

});