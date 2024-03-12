import { App } from "./App";
import { TEXT } from "./Consts";
import { ObjectLoader } from "./data/ObjectLoader";
import { UserInterfaceObject } from "./view/UserInterfaceObject";

export class StringRepresentations {
    static getStringRepresentation(identity) : string {
        if (identity instanceof UserInterfaceObject) {
            let uio : UserInterfaceObject = identity;
            if (uio.semsAddress != null) {
                if (ObjectLoader.isLoaded(uio.semsAddress)) {
                    return "UIO [semsAddress = " + uio.semsAddress + ", " + App.objProperties.get(uio.semsAddress, TEXT) + "]";
                } else {
                    return "UIO [semsAddress = " + uio.semsAddress + "]";
                }
            } else {
                return "UIO [viewType = " + uio.viewType + "]";
            }
        }
        return identity;
    }
}