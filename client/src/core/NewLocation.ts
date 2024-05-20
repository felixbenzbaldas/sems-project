import {Path} from "@/core/Path";
import {ObjectNew} from "@/core/ObjectNew";
import {NewHttp} from "@/core/NewHttp";
import {PathUtil} from "@/core/PathUtil";

export class NewLocation {

    private httpAddress : string;

    constructor(http: NewHttp) {
    }

    setHttpAddress(httpAddress: string) {
        this.httpAddress = httpAddress;
    }

    async createObjectWithText(housePath: Path, text : string) : Promise<string> {
        return fetch(this.httpAddress, {
            method: 'POST',
            body: JSON.stringify({
                'method': 'createObjectWithText',
                'args' : [
                    ['house1'], text
                ]
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'charset' : 'UTF-8'
            },
        }).then(response => {
            return response.json();
        });
    }
}