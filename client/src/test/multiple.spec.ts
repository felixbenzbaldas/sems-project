import {describe, expect, it, test} from "vitest";
import {Identity} from "@/Identity";
import {Starter} from "@/Starter";
import {wait} from "@/utils";
import {Subject} from "rxjs";


describe('jobPipeline', () => {

    it('can run job', async () => {
        let app : Identity = Starter.createApp();
        app.appA.logG.toListOfStrings = true;

        await app.jobPipeline_runLater(() => {
            app.log('run job');
        });

        expect(app.appA.logG.listOfStrings.join()).contains('run job');
    });

});