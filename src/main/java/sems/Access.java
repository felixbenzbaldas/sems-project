package sems;

import static sems.Consts.IS_PRIVATE;

import sems.web.Web;

public class Access {
	
	public static boolean checkAccess(SemsObject semsObject) {
		if (Web.runOnServer()) {
			if (semsObject.props.get(IS_PRIVATE) != null) {
				if (semsObject.props.getBoolean(IS_PRIVATE)) {
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