import { SEMS_ADDRESS } from "../Consts";
import { MapWithPrimitiveStringsAsKey } from "../general/MapWithPrimitiveStringsAsKey";
import { RemotePropertiesOfSemsObject } from "./RemotePropertiesOfSemsObject";


export class RemoteProperties {

	private map : MapWithPrimitiveStringsAsKey = new MapWithPrimitiveStringsAsKey();
	
	public createFromJson(json) {
		let props = RemotePropertiesOfSemsObject.createFromJson(json);
		this.map.set(json[SEMS_ADDRESS], props);
	}

	public has(semsAddress: string) {
		return this.map.has(semsAddress);
	}

	public getPropertiesOfObject(semsAddress : string) : RemotePropertiesOfSemsObject{
		return this.map.get(semsAddress);
	}

	public setProperty(semsAddress : string, property : string, value) {
		this.getPropertiesOfObject(semsAddress).set(property, value);
	}

	public get(semsAddress : string, property : string) : any {
		return this.getPropertiesOfObject(semsAddress).get(property);
	}
}