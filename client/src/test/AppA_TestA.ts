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
            if (await test.action()) {
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
        let tests = [
            this.test('create application', async test => {
                let app = Starter.createApp();

                return app.text === 'Sems application';
            })
        ];
        if (this.withFailingDemoTest) {
            tests.push(this.test('failing demo test (don\'t worry - this test always fails)', async test => {
                return false;
            }));
        }
        return tests;
    }

    private test(name: string, action: (test: Entity) => Promise<any>) : Entity {
        let test = this.appA.simple_createText(name);
        test.action = async () => {
            return await action(test);
        }
        return test;
    }
}