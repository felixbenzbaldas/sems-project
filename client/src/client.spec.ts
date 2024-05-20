import {describe, expect, it} from 'vitest'
import {NewLocation} from "@/core/NewLocation";
import {PathUtil} from "@/core/PathUtil";
import {NewHttp} from "@/core/NewHttp";
import type {Path} from "@/core/Path";

const testServer = 'http://localhost:8081/';

describe('house', () => {
    it('can create object with text', async () => {
        let http = new NewHttp();
        let location = new NewLocation(http);
        location.setHttpAddress(testServer);

        let nameOfObject : string = await location.createObjectWithText(PathUtil.fromList(['house1']), 'some text');

        expect(nameOfObject).match(/^[0-9a-zA-Z]{5,20}$/);
    });
});