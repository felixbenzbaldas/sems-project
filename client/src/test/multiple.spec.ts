import {describe, expect, it} from "vitest";
import {Identity} from "@/Identity";
import {Starter} from "@/Starter";
import {wait} from "@/utils";


describe('jobPipeline', () => {

    it('can run job', async () => {
        let app : Identity = Starter.createApp();
        app.appA.logG.toListOfStrings = true;

        await app.jobPipelineG.runLater(() => {
            app.log('run job');
        });

        expect(app.appA.logG.listOfStrings.join()).contains('run job');
    });

    it('runs job not before previous job finished', async () => {
        let app : Identity = Starter.createApp();
        app.appA.logG.toListOfStrings = true;
        app.jobPipelineG.runLater(async () => {
            await wait(20);
        });

        app.jobPipelineG.runLater(async () => {
            app.log('run job');
        })

        await wait(10);
        expect(app.appA.logG.listOfStrings.join()).not.contains('run job');
        await wait(20);
        expect(app.appA.logG.listOfStrings.join()).contains('run job');
    });

});

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