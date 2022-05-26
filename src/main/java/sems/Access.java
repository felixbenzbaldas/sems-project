package sems;

import static sems.Consts.IS_PRIVATE;

import sems.general.PropertiesOfIdentity;
import sems.web.Web;

public class Access {
	
	public static boolean checkAccess(SemsObject semsObject) {
		if (Web.runOnServer()) {
			PropertiesOfIdentity props = App.objProperties.getPropertiesOfIdentity(semsObject.getSemsAddress());
			if (props.get(IS_PRIVATE) != null) {
				if (App.objProperties.getBoolean(semsObject.getSemsAddress(), IS_PRIVATE)) {
					return false;
				}				
			}
			if (semsObject.getSemsHouse() == App.semsHouseOne) {
				return false;
			}
		}
		return true;
	}
}