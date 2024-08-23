import {describe, expect, it} from "vitest";

/// Test the underlying platform. These tests do not test Sems code, but the api of the used platform.
describe('platform', () => {

    it('can parse json string', async () => {
        let json = JSON.parse('{"text":"bar"}');

        expect(json.text).toEqual('bar');
    });
});