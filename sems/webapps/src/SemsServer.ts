import { App } from "./App";
import { CONTEXT, CONTEXT_DETAIL_AT_POSITION, CREATE_CONTEXT, DEFAULT_EXPANDED, DELETE_CONTEXT, DELETE_DETAIL, DETAIL, GET_DETAILS, INSERT_LINK_DETAIL_AT_POSITION, IS_PRIVATE, METHOD, POSITION, ROOT_OBJECT, SAVE, SEMS_HOUSE, SEMS_ADDRESS, SET_PRIVATE, SET_TEXT, TEXT_OBJECT, SET_PROPERTY, PROPERTY, GET_OBJ, SUCCESS, CLEAR, CLEAN, UPDATE, SAVE_CHANGES, SEARCH} from "./Consts";
import { General } from "./general/General";
import { ServerRequest } from "./general/ServerRequest";

export class SemsServer {

    public static getAddressForObject(semsAddress : string) {
        if (App.EN_VERSION) {
            return "/en/?" + semsAddress;
        } else {
            return "/?" + semsAddress;
        }
    }

    // note: the server returns a list of json objects!
    public static requestSemsObject(semsAddress : string, callback : Function) {
        let serverRequest : ServerRequest = new ServerRequest();
        serverRequest.setType_GET();
        serverRequest.setArg(METHOD, GET_OBJ);
        serverRequest.callback = function(response) {
            callback(JSON.parse(response));
        };
        serverRequest.setArg(SEMS_ADDRESS, semsAddress);
        serverRequest.doRequest();
    }

    public static deleteDetail(context: string, detail: string) {
        let serverRequest : ServerRequest = new ServerRequest();
        serverRequest.setType_POST();
        serverRequest.setArg(METHOD, DELETE_DETAIL);
        serverRequest.setArg(CONTEXT, context);
        serverRequest.setArg(DETAIL, detail);
        serverRequest.doRequest();
    }

    public static createTextObject(name : string, callback : (object : string) => void) {
        let serverRequest : ServerRequest = new ServerRequest();
        serverRequest.setType_POST();
        serverRequest.setArg(METHOD, TEXT_OBJECT);
        serverRequest.setArg(SEMS_HOUSE, App.currentWritingLocation);
        serverRequest.callback = function(semsAddress) {
            callback(semsAddress);
        }
        serverRequest.content = name;
        serverRequest.doRequest();
    }

    public static insertLinkDetailAtPosition(context: string, detail: string, position: number) {
        let serverRequest : ServerRequest = new ServerRequest();
        serverRequest.setType_POST();
        serverRequest.setArg(METHOD, INSERT_LINK_DETAIL_AT_POSITION);
        serverRequest.setArg(CONTEXT, context);
        serverRequest.setArg(DETAIL, detail);
        serverRequest.setArg(POSITION, new Number(position).toString());
        serverRequest.doRequest();
    }

    public static createContextDetailAtPosition(text: string, position: number, context : string, callback: (object : string) => void) {
        let serverRequest : ServerRequest = new ServerRequest();
        serverRequest.setType_POST();
        serverRequest.setArg(METHOD, CONTEXT_DETAIL_AT_POSITION);
        serverRequest.setArg(SEMS_HOUSE, App.currentWritingLocation);
        serverRequest.setArg(CONTEXT, context);
        serverRequest.setArg(POSITION, new Number(position).toString());
        serverRequest.content = text;
        serverRequest.callback = function(semsAddress) {
            callback(semsAddress);
        };
        serverRequest.doRequest();
    }

    public static setProperty(semsAddress: string, property : string, value) {
        let serverRequest : ServerRequest = new ServerRequest();
        serverRequest.setType_POST();
        serverRequest.setArg(METHOD, SET_PROPERTY);
        serverRequest.setArg(SEMS_ADDRESS, semsAddress);
        serverRequest.setArg(PROPERTY, property);
        serverRequest.content = value;
        serverRequest.doRequest();
    }
    
    public static createDetail(context : string, detail : string, callback : Function) {
        let serverRequest : ServerRequest = new ServerRequest();
        serverRequest.setType_POST();
        serverRequest.setArg(METHOD, DETAIL);
        serverRequest.setArg(CONTEXT, context);
        serverRequest.setArg(DETAIL, detail);
        serverRequest.callback = function(semsAddress) {
            callback(semsAddress);
        };
        serverRequest.doRequest();
    }

    public static requestRootObject(callback : Function) {
        let serverRequest : ServerRequest = new ServerRequest();
        serverRequest.setType_GET();
        serverRequest.setArg(METHOD, ROOT_OBJECT);
        serverRequest.callback = function(jsonText) {
            callback(JSON.parse(jsonText));
        }
        serverRequest.doRequest();
    }

    public static getDetails(semsAddress: string, callback : Function) {
        let serverRequest : ServerRequest = new ServerRequest();
        serverRequest.setType_GET();
        serverRequest.setArg(METHOD, GET_DETAILS);
        serverRequest.setArg(SEMS_ADDRESS, semsAddress);
        serverRequest.callback = function(jsonText) {
            callback(JSON.parse(jsonText));
        }
        serverRequest.doRequest();
    }

    public static save() {
        let serverRequest : ServerRequest = new ServerRequest();
        serverRequest.setType_POST();
        serverRequest.setArg(METHOD, SAVE);
        serverRequest.callback = function(returnValue : string) {
            if (General.primEquals(returnValue, SUCCESS)) {
                alert("saved");
            }
        }
        serverRequest.doRequest();
    }

    public static saveChanges() {
        let serverRequest : ServerRequest = new ServerRequest();
        serverRequest.setType_POST();
        serverRequest.setArg(METHOD, SAVE_CHANGES);
        serverRequest.callback = function(returnValue : string) {
            if (General.primEquals(returnValue, SUCCESS)) {
                alert("saved changes");
            }
        }
        serverRequest.doRequest();
    }

    public static clear(semsAddress: string, callback : Function) {
        let serverRequest : ServerRequest = new ServerRequest();
        serverRequest.setType_POST();
        serverRequest.setArg(METHOD, CLEAR);
        serverRequest.setArg(SEMS_ADDRESS, semsAddress);
        serverRequest.callback = function(returnValue : string) {
            if (General.primEquals(returnValue, SUCCESS)) {
                callback();
            }
        };
        serverRequest.doRequest();
    }


    public static clean() {
        let serverRequest : ServerRequest = new ServerRequest();
        serverRequest.setType_POST();
        serverRequest.setArg(METHOD, CLEAN);
        serverRequest.callback = function(returnValue : string) {
            if (General.primEquals(returnValue, SUCCESS)) {
                alert("Cleaning was successfull!");
            } else {
                alert("Error!");
            }
        };
        serverRequest.doRequest();
    }

    public static update() {
        let serverRequest : ServerRequest = new ServerRequest();
        serverRequest.setType_POST();
        serverRequest.setArg(METHOD, UPDATE);
        serverRequest.callback = function(returnValue : string) {
            if (General.primEquals(returnValue, SUCCESS)) {
                alert("Update was successfull!");
            } else {
                alert("Error!");
            }
        };
        serverRequest.doRequest();
    }

    public static search(semsAddress : string, callback : Function) {
        let serverRequest : ServerRequest = new ServerRequest();
        serverRequest.setType_GET(); // XXX wird das überhaupt benötigt?
        serverRequest.setArg(METHOD, SEARCH);
        serverRequest.setArg(SEMS_ADDRESS, semsAddress);
        serverRequest.callback = function(jsonText) {
            callback(JSON.parse(jsonText));
        }
        serverRequest.doRequest();
    }

}