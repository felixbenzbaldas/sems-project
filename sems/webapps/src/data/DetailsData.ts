import { App } from "../App";
import { DEFAULT_EXPANDED, DETAILS, HAS_DETAILS, LOAD_DEPENDENCIES, SEMS_ADDRESS } from "../Consts";
import { List } from "../general/List";
import { MapWithPrimitiveStringsAsKey } from "../general/MapWithPrimitiveStringsAsKey";
import { ObjectLoader } from "./ObjectLoader";
import { SemsServer } from "../SemsServer";
import { EventTypes } from "../EventTypes";

export class DetailsData {

    public static map : MapWithPrimitiveStringsAsKey = new MapWithPrimitiveStringsAsKey();

    private semsAddress: string;
    private _hasDetails: boolean;
    // if details == null that does not mean there are no details. Maybe they are just not loaded.
    private details : Array<string>;


    public static createFromJson(json) {
        let detailsData : DetailsData = new DetailsData();
        detailsData.semsAddress = json[SEMS_ADDRESS];
        if (App.objProperties.get(detailsData.semsAddress, DEFAULT_EXPANDED)) {
            detailsData.details = json[DETAILS];
        }
        detailsData._hasDetails = json[HAS_DETAILS];
        DetailsData.map.set(detailsData.semsAddress, detailsData);
    }

    public hasDetails() : boolean {
        return this._hasDetails;
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
        if (this.details.length == 0) {
            this._hasDetails = false;
        }
        App.objEvents.triggerEvent(this.semsAddress, EventTypes.DETAILS_CHANGE, null);
    }

    // also ensures that created detail is loaded
    public createContextDetailAtPostion(text : string, position : number, callback : Function) {
        let self = this;
        SemsServer.createContextDetailAtPosition(text, position, this.semsAddress, function(addressOfNewDetail) {
            ObjectLoader.ensureLoaded(addressOfNewDetail, function() {
                self.insertDetailAtPosition(addressOfNewDetail, position);
                App.objEvents.triggerEvent(self.semsAddress, EventTypes.DETAILS_CHANGE, null);
                callback(addressOfNewDetail);
            });
        });
    }

    private insertDetailAtPosition(detail : string, position : number) {
        List.insertInListAtPosition(this.details, detail, position);
        this._hasDetails = true;
    }

    public createLinkDetailAtPostion(detailSemsAddress : string, position : number) {
        this.insertDetailAtPosition(detailSemsAddress, position);
        SemsServer.insertLinkDetailAtPosition(this.semsAddress, detailSemsAddress, position);
        App.objEvents.triggerEvent(this.semsAddress, EventTypes.DETAILS_CHANGE, null);
    }

    public clear() {
        this.details = [];
    }

}