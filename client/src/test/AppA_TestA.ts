import type {Entity} from "@/Entity";
import {Starter} from "@/Starter";

export class AppA_TestA {

    constructor(private entity : Entity) {
        this.createResults();
    }

    createResults() {
        let successCounter = 0;
        for (let test of this.getTests()) {
            test.action();
            if (test.test_successful) {
                successCounter++;
            } else {
                this.entity.appA.ui.content.list.add(this.entity.appA.simple_createTextWithList('FAILED', this.entity.appA.simple_createText(test.text)));
            }
        }
        this.entity.appA.ui.content.list.add(this.entity.appA.simple_createTextWithList('successful tests: '
            + successCounter));
    }

    getTests() : Array<Entity> {
        let testList : Array<Entity> = [];
        {
            let testName = 'create application';
            let test = this.entity.appA.simple_createText(testName);
            test.action = () => {
                let app = Starter.createApp();

                test.test_successful = app.text === 'Sems application';
            };
            testList.push(test);
        }
        return testList;
    }
}