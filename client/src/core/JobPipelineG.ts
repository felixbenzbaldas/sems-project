export class JobPipelineG {

    previousFinishedPromise : Promise<any> = Promise.resolve();

    async runLater(job: Function) {
        let promise = this.previousFinishedPromise.then(async () => {
            await job();
        });
        this.previousFinishedPromise = promise;
        await promise;
    }
}