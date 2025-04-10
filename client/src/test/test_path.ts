import type {TestG_NestedTestsA} from "@/tester/TestG_NestedTestsA";
import {Entity} from "@/Entity";
import {assert_sameAs} from "@/utils";
import type {PathA} from "@/PathA";

export function test_path_add(tests : TestG_NestedTestsA) {
    tests.addNestedTests('path', path => {
        path.addNestedTests('getPath', getPathTest => {
            getPathTest.add('ofContained', async run => {
                let text = await run.app.createText('');

                let path: PathA = run.app.entity.getPath(text);

                assert_sameAs(path.listOfNames.length, 1);
                assert_sameAs(path.listOfNames[0], text.name);
            });
            getPathTest.add('ofContainedOfContained', async run => {
                let container = await run.app.createText('container');
                container.installContainerA();
                let containedContained = await container.containerA.createText('containedContained');

                let path : PathA = run.app.entity.getPath(containedContained);

                assert_sameAs(path.listOfNames.length, 2);
                assert_sameAs(path.listOfNames[0], container.name);
                assert_sameAs(path.listOfNames[1], containedContained.name);
            });
            getPathTest.add('ofContainer', async run => {
                let text = await run.app.createText('');

                let path: PathA = text.getPath(run.app.entity);

                assert_sameAs(path.listOfNames.length, 1);
                assert_sameAs(path.listOfNames[0], '..');
            });
            getPathTest.add('ofContainedOfContainedOfContainer', async run => {
                let container = await run.app.createText('container');
                container.installContainerA();
                let containedContained = await container.containerA.createText('containedContained');
                let text = await run.app.createText('foo');

                let path : PathA = text.getPath(containedContained);

                assert_sameAs(path.listOfNames.length, 3);
                assert_sameAs(path.listOfNames[0], '..');
                assert_sameAs(path.listOfNames[1], container.name);
                assert_sameAs(path.listOfNames[2], containedContained.name);
            });
            getPathTest.add('ofContainer-WhichHasAContainerItself', async run => {
                let container = await run.app.createText('container');
                container.installContainerA();
                let containedContained = await container.containerA.createText('containedContained');
                let text = await run.app.createText('foo');

                let path: PathA = containedContained.getPath(container);

                assert_sameAs(path.listOfNames.length, 1);
                assert_sameAs(path.listOfNames[0], '..');
            });
        });
        path.addNestedTests('resolve', path_resolve => {
            path_resolve.add('direct', async run => {
                let entity = run.app.createEntityWithApp();
                let path = run.app.direct(entity);

                let resolved = await path.resolve();

                assert_sameAs(resolved, entity);
            });
            path_resolve.addTestWithNestedTests('listOfNames', async run => {
                let container = run.app.createEntityWithApp();
                container.installContainerA();
                let contained = await container.containerA.createBoundEntity();
                let path = container.getPath(contained);

                let resolved = await path.resolve();

                assert_sameAs(resolved, contained);
            }, listOfNamesTests => {
                listOfNamesTests.add('containedOfContainer', async run => {
                    let object: Entity = await run.app.createText('bar');
                    let otherObject: Entity = await run.app.createText('foo');
                    let pathOfOther: PathA = object.getPath(otherObject);

                    let resolved: Entity = await pathOfOther.resolve();

                    assert_sameAs(resolved, otherObject);
                });
                listOfNamesTests.add('containedOfContainedOfContainer', async run => {
                    let container = await run.app.createText('container');
                    container.installContainerA();
                    let containedContained = await container.containerA.createText('containedContained');
                    let text = await run.app.createText('foo');
                    let path = text.getPath(containedContained);

                    let resolved: Entity = await path.resolve();

                    assert_sameAs(resolved, containedContained);
                });
            });
        });
    });
}