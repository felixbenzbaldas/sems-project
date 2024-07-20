import {describe, expect, it} from "vitest";
import {Location} from "@/core/Location";
import {House} from "@/core/House";
import {SemsObject} from "@/core/SemsObject";
import {Path} from "@/core/Path";

describe('location', () => {
    it('can get path of object', () => {
        let location = new Location(null, null);
        let house = new House(null, location, 'house2');
        let object = new SemsObject(location, 'kfj6346jEE', {text:'foo'});
        object.setContainer(house);

        let path : Path = location.getPath(object);

        expect(path.toList()).toEqual(['house2', 'kfj6346jEE']);
    });
});