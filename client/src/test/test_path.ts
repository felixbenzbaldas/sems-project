import type {TestG_NestedTestsA} from "@/tester/TestG_NestedTestsA";
import {Entity} from "@/Entity";
import {assert_sameAs} from "@/utils";

export function test_path_add(tests : TestG_NestedTestsA) {
    tests.addNestedTests('path', path => {
        path.addNestedTests('getPath', getPathTest => {
            getPathTest.add('ofContained', async run => {
                let text = await run.app.createText('');

                let path: Entity = run.app.entity.getPath(text);

                assert_sameAs(path.pathA.listOfNames.length, 1);
                assert_sameAs(path.pathA.listOfNames.at(0), text.name);
            });
            getPathTest.add('ofContainedOfContained', async run => {
                let container = await run.app.createText('container');
                container.installContainerA();
                let containedContained = await container.containerA.createText('containedContained');

                let path: Entity = run.app.entity.getPath(containedContained);

                assert_sameAs(path.pathA.listOfNames.length, 2);
                assert_sameAs(path.pathA.listOfNames.at(0), container.name);
                assert_sameAs(path.pathA.listOfNames.at(1), containedContained.name);
            });
            getPathTest.add('ofContainer', async run => {
                let text = await run.app.createText('');

                let path: Entity = text.getPath(run.app.entity);

                assert_sameAs(path.pathA.listOfNames.length, 1);
                assert_sameAs(path.pathA.listOfNames[0], '..');
            });
            getPathTest.add('ofContainedOfContainedOfContainer', async run => {
                let container = await run.app.createText('container');
                container.installContainerA();
                let containedContained = await container.containerA.createText('containedContained');
                let text = await run.app.createText('foo');

                let path: Entity = text.getPath(containedContained);

                assert_sameAs(path.pathA.listOfNames.length, 3);
                assert_sameAs(path.pathA.listOfNames[0], '..');
                assert_sameAs(path.pathA.listOfNames[1], container.name);
                assert_sameAs(path.pathA.listOfNames[2], containedContained.name);
            });
            getPathTest.add('ofContainer-WhichHasAContainerItself', async run => {
                let container = await run.app.createText('container');
                container.installContainerA();
                let containedContained = await container.containerA.createText('containedContained');
                let text = await run.app.createText('foo');

                let path: Entity = containedContained.getPath(container);

                assert_sameAs(path.pathA.listOfNames.length, 1);
                assert_sameAs(path.pathA.listOfNames[0], '..');
            });
        });
        path.addNestedTests('resolve', path_resolve => {
            path_resolve.add('direct', async run => {
                let entity = run.app.createEntityWithApp();
                let path = run.app.direct(entity);

                let resolved = await path.pathA.resolve();

                assert_sameAs(resolved, entity);
            });
            path_resolve.addTestWithNestedTests('listOfNames', async run => {
                let container = run.app.createEntityWithApp();
                container.installContainerA();
                let contained = await container.containerA.createBoundEntity();
                let path = container.getPath(contained);

                let resolved = await path.pathA.resolve();

                assert_sameAs(resolved, contained);
            }, listOfNamesTests => {
                listOfNamesTests.add('containedOfContainer', async run => {
                    let object: Entity = await run.app.createText('bar');
                    let otherObject: Entity = await run.app.createText('foo');
                    let pathOfOther: Entity = object.getPath(otherObject);

                    let resolved: Entity = await pathOfOther.pathA.resolve();

                    assert_sameAs(resolved, otherObject);
                });
                listOfNamesTests.add('containedOfContainedOfContainer', async run => {
                    let container = await run.app.createText('container');
                    container.installContainerA();
                    let containedContained = await container.containerA.createText('containedContained');
                    let text = await run.app.createText('foo');
                    let path = text.getPath(containedContained);

                    let resolved: Entity = await path.pathA.resolve();

                    assert_sameAs(resolved, containedContained);
                });
            });
        });
    });
}