import type {Entity} from "@/Entity";
import {Starter} from "@/Starter";
import type {AppA} from "@/core/AppA";

export class AppA_TestA {

    private readonly appA : AppA;

    constructor(private entity : Entity) {
        this.appA = entity.appA;
        this.createResults();
    }

    createResults() {
        let successCounter = 0;
        for (let test of this.getTests()) {
            test.action();
            if (test.test_successful) {
                successCounter++;
            } else {
                this.appA.ui.content.list.add(this.appA.simple_createTextWithList('FAILED',
                    this.appA.simple_createText(test.text)));
            }
        }
        this.appA.ui.content.list.add(
            this.appA.simple_createTextWithList('successful tests: ' + successCounter),
            this.appA.simple_createText(''),
            this.appA.simple_createTextWithList('specifications',
                this.appA.simple_createText('The tester shows this specification.')));
    }

    getTests() : Array<Entity> {
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
        return testList;
    }
}