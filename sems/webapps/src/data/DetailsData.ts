import { App } from "../App";
import { DEFAULT_EXPANDED, DETAILS, LOAD_DEPENDENCIES, SEMS_ADDRESS } from "../Consts";
import { List } from "../general/List";
import { MapWithPrimitiveStringsAsKey } from "../general/MapWithPrimitiveStringsAsKey";
import { ObjectLoader } from "./ObjectLoader";
import { SemsServer } from "../SemsServer";

export class DetailsData {

    public static map : MapWithPrimitiveStringsAsKey = new MapWithPrimitiveStringsAsKey();

    private semsAddress: string;
    private hasDetailsAfterLoading: boolean;
    private details : Array<string>;

    constructor(semsAddress : string, hasDetailsAfterLoading : boolean, details : Array<string>) {
        this.semsAddress = semsAddress;
        if (App.objProperties.get(semsAddress, DEFAULT_EXPANDED)) {
            this.details = details;
        }
        this.hasDetailsAfterLoading = hasDetailsAfterLoading;
    }

    public hasDetails() : boolean {
        if (this.details == null) {
            return this.hasDetailsAfterLoading;
        } else {
            return this.details.length > 0;
        }
    }

    public getDetails() : Array<string> {
        return this.details;
    }

    public ensureDetailsAreLoaded(callback : Function) {
        if (this.checkDetailsAreLoaded()) {
            callback();
        } else {
            let self = this;
            SemsServer.getDetails(this.semsAddress, function (json) {
                if (!self.checkDetailsAreLoaded()) {
                    ObjectLoader.listOfJsonObjectsArrived(json[LOAD_DEPENDENCIES]);
                    self.details = json[DETAILS];
                }
                callback();
            });
        }
    }

    public checkDetailsAreLoaded() : boolean {
        if (this.details == null) {
            return false;
        } else {
            return ObjectLoader.listIsLoaded(this.details);
        }
    }

    public deleteDetail(semsAddress : string, position : number) {
        SemsServer.deleteDetail(this.semsAddress, semsAddress);
        List.deleteInListAtPosition(this.details, position);
    }

    public createContextDetailAtPostion(text : string, position : number, callback : Function) {
        let self = this;
        SemsServer.createContextDetailAtPosition(text, position, this.semsAddress, function(addressOfNewDetail) {
            ObjectLoader.ensureLoaded(addressOfNewDetail, function() {
                List.insertInListAtPosition(self.details, addressOfNewDetail, position);
                callback(addressOfNewDetail);
            });
        });
    }

    public createLinkDetailAtPostion(detailSemsAddress : string, position : number) {
        List.insertInListAtPosition(this.details, detailSemsAddress, position);
        SemsServer.insertLinkDetailAtPosition(this.semsAddress, detailSemsAddress, position);
    }

    public clear() {
        this.details = [];
    }
}