import {describe, expect, it} from "vitest";
import {wait} from "@/utils";

/// Test the underlying platform. These tests do not test ES code, but the api of the used platform.
describe('platform', () => {

    it('can parse json string', async () => {
        let json = JSON.parse('{"text":"bar"}');

        expect(json.text).toEqual('bar');
    });

    it('null and undefined', async () => {
        expect(undefined == null).toBe(true);
        expect(undefined != null).toBe(false);
        expect(undefined === null).toBe(false);
        expect(undefined !== null).toBe(true);
        expect(null ?? 42).toBe(42);
    });
});

describe('slow tests', () => {

    it('can wait', async () => {
        let flag = false;
        setTimeout(() => {
            flag = true;
        }, 100);

        await wait(150);

        expect(flag).toBe(true);
    })
});