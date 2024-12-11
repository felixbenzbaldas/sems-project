import {StarterA} from "@/StarterA";
import type {Entity} from "@/Entity";
import {ContainerA} from "@/ContainerA";
import {assert_sameAs} from "@/utils";

export class AppA_TestA_PathG {

    constructor(private entity: Entity) {
    }

    createTests() {
        return [
            this.createTest('getPath of contained', async test => {
                test.test_app = this.entity.appA.createStarter().createApp();
                let app = test.test_app;
                let text = await app.appA.createText('');

                let path: Entity = app.getPath(text);

                return path.pathA.listOfNames.length === 1 &&
                    path.pathA.listOfNames.at(0) === text.name;
            }),
            this.createTest('getPath of contained of contained', async test => {
                test.test_app = this.entity.appA.createStarter().createApp();
                let app = test.test_app;
                app.appA.logG.toListOfStrings = true;
                let container = await app.appA.createText('container');
                container.installContainerA();
                let containedContained = await container.containerA.createText('containedContained');

                let path: Entity = app.getPath(containedContained);

                return path.pathA.listOfNames.length === 2 &&
                    path.pathA.listOfNames.at(0) === container.name &&
                    path.pathA.listOfNames.at(1) === containedContained.name;
            }),
            this.createTest('getPath of container', async test => {
                test.test_app = this.entity.appA.createStarter().createApp();
                let app = test.test_app;
                let text = await app.appA.createText('');

                let path: Entity = text.getPath(app);

                return path.pathA.listOfNames.length === 1 &&
                    path.pathA.listOfNames.at(0) === '..';
            }),
            this.createTest('getPath of contained of contained of container', async test => {
                test.test_app = this.entity.appA.createStarter().createApp();
                let app = test.test_app;
                app.appA.logG.toListOfStrings = true;
                let container = await app.appA.createText('container');
                container.installContainerA();
                let containedContained = await container.containerA.createText('containedContained');
                let text = await app.appA.createText('foo');

                let path: Entity = text.getPath(containedContained);

                return path.pathA.listOfNames.length === 3 &&
                    path.pathA.listOfNames.at(0) === '..' &&
                    path.pathA.listOfNames.at(1) === container.name &&
                    path.pathA.listOfNames.at(2) === containedContained.name;
            }),
            this.createTest('getPath of container (which has a container itself)', async test => {
                test.test_app = this.entity.appA.createStarter().createApp();
                let app = test.test_app;
                app.appA.logG.toListOfStrings = true;
                let container = await app.appA.createText('container');
                container.installContainerA();
                let containedContained = await container.containerA.createText('containedContained');
                let text = await app.appA.createText('foo');

                let path: Entity = containedContained.getPath(container);

                return path.pathA.listOfNames.length === 1 &&
                    path.pathA.listOfNames.at(0) === '..';
            }),
            this.createTest('resolve contained of container', async test => {
                let app: Entity = this.entity.appA.createStarter().createApp();
                let object: Entity = await app.appA.createText('bar');
                let otherObject: Entity = await app.appA.createText('foo');
                let pathOfOther: Entity = object.getPath(otherObject);

                let resolved: Entity = await pathOfOther.pathA.resolve();

                assert_sameAs(resolved, otherObject);
            }),
            this.createTest('resolve contained of contained of container', async test => {
                test.test_app = this.entity.appA.createStarter().createApp();
                let app = test.test_app;
                app.appA.logG.toListOfStrings = true;
                let container = await app.appA.createText('container');
                container.installContainerA();
                let containedContained = await container.containerA.createText('containedContained');
                let text = await app.appA.createText('foo');
                let path = text.getPath(containedContained);

                let resolved: Entity = await path.pathA.resolve();

                assert_sameAs(resolved, containedContained);
            }),
        ];
    }

    private createTest(name: string, testAction: (test: Entity) => Promise<any>) {
        return this.entity.appA.testA.createTest(name, testAction);
    }
    
}