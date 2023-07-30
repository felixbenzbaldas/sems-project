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
    private hasDetailsAfterLoading: boolean;
    private details : Array<string>;


    public static createFromJson(json) {
        let detailsData : DetailsData = new DetailsData();
        detailsData.semsAddress = json[SEMS_ADDRESS];
        if (App.objProperties.get(detailsData.semsAddress, DEFAULT_EXPANDED)) {
            detailsData.details = json[DETAILS];
        }
        detailsData.hasDetailsAfterLoading = json[HAS_DETAILS];
        DetailsData.map.set(detailsData.semsAddress, detailsData);
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
        App.objEvents.triggerEvent(this.semsAddress, EventTypes.DETAILS_CHANGE, null);
    }

    // also ensures that created detail is loaded
    public createContextDetailAtPostion(text : string, position : number, callback : Function) {
        let self = this;
        SemsServer.createContextDetailAtPosition(text, position, this.semsAddress, function(addressOfNewDetail) {
            ObjectLoader.ensureLoaded(addressOfNewDetail, function() {
                List.insertInListAtPosition(self.details, addressOfNewDetail, position);
                App.objEvents.triggerEvent(self.semsAddress, EventTypes.DETAILS_CHANGE, null);
                callback(addressOfNewDetail);
            });
        });
    }

    public createLinkDetailAtPostion(detailSemsAddress : string, position : number) {
        List.insertInListAtPosition(this.details, detailSemsAddress, position);
        SemsServer.insertLinkDetailAtPosition(this.semsAddress, detailSemsAddress, position);
        App.objEvents.triggerEvent(this.semsAddress, EventTypes.DETAILS_CHANGE, null);
    }

    public clear() {
        this.details = [];
    }

    // not used at the moment
    public setHasDetailsAfterLoading(hasDetailsAfterLoading : boolean) {
        this.hasDetailsAfterLoading = hasDetailsAfterLoading;
        App.objEvents.triggerEvent(this.semsAddress, EventTypes.DETAILS_CHANGE, null);
    }

    public setDetails(details : Array<string>) {
        this.details = details;
        App.objEvents.triggerEvent(this.semsAddress, EventTypes.DETAILS_CHANGE, null);
    }
}