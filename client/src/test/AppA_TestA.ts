import type {Entity} from "@/Entity";
import {Starter} from "@/Starter";
import type {AppA} from "@/core/AppA";

export class AppA_TestA {

    private readonly appA : AppA;
    withFailingDemoTest: boolean;

    constructor(private entity : Entity) {
        this.appA = entity.appA;
    }

    async run() {
        this.appA.ui.content.list.jsList = [];
        let successCounter = 0;
        for (let test of this.createTests()) {
            test.action();
            if (test.test_successful) {
                successCounter++;
            } else {
                await this.appA.ui.content.list.add(this.appA.simple_createTextWithList('FAILED',
                    this.appA.simple_createText(test.text)));
            }
        }
        await this.appA.ui.content.list.add(
            this.appA.simple_createTextWithList('successful tests: ' + successCounter),
            this.appA.simple_createText(''),
            this.appA.simple_createTextWithList('specifications',
                this.appA.simple_createText('The tester shows this specification.'),
                this.appA.simple_createText('Can show failing demo test.')));
    }

    createTests() : Array<Entity> {
        let testList : Array<Entity> = [];
        {
            let testName = 'create application';
            let test = this.appA.simple_createText(testName);
            test.action = () => {
                let app = Starter.createApp();

                test.test_successful = app.text === 'Sems application';
            };
            testList.push(test);
        }
        if (this.withFailingDemoTest) {
            let testName = 'failing demo test (don\'t worry - this test always fails)';
            let test = this.appA.simple_createText(testName);
            test.action = () => {
                test.test_successful = false;
            };
            testList.push(test);
        }
        return testList;
    }
}