import type {Entity} from "@/Entity";
import {assert} from "@/utils";

export const appTest = (app : Entity) => {
    let test = app.createFormalText('appTest', (run : Entity) => {
        assert(true);
    });
    return test;
}