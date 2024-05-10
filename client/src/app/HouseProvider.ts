import {House} from "./House";

export interface HouseProvider {
    get(houseAddress : string) : House;
}