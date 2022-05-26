package sems.web;

import static sems.Consts.DEFAULT_EXPANDED;
import static sems.Consts.DETAILS;
import static sems.Consts.HAS_DETAILS;
import static sems.Consts.PROPERTIES;
import static sems.Consts.SEMS_ADDRESS;
import static sems.Consts.TEXT;

import java.util.HashMap;
import java.util.Map;

import sems.Access;
import sems.App;
import sems.SemsObject;
import sems.general.PropertiesOfIdentity;

public class JsonWeb {
	
	static public Object getJson(SemsObject semsObject) {
		if (Access.checkAccess(semsObject)) {
			return getJson_AccessGranted(semsObject);
		} else {
			return getJson_AccessDenied(semsObject);
		}
	}
	
	static private Object getJson_AccessGranted(SemsObject semsObject) {
		Map<String, Object> jsonObject = new HashMap<String, Object>();
		String semsAddress = semsObject.getSemsAddress();
		jsonObject.put(SEMS_ADDRESS, semsAddress);
		PropertiesOfIdentity props = App.objProperties.getPropertiesOfIdentity(semsAddress);
		if (props.get(DEFAULT_EXPANDED) != null) {
			if (props.getBoolean(DEFAULT_EXPANDED)) {
				jsonObject.put(DETAILS, semsObject.getDetails());
			}
		}
		jsonObject.put(HAS_DETAILS, semsObject.getDetails().size() > 0);
		jsonObject.put(PROPERTIES, App.getJsonOfProperties(semsAddress));
		return jsonObject;
	}
	
	static private Object getJson_AccessDenied(SemsObject semsObject) {
		Map<String, Object> jsonObject = new HashMap<String, Object>();
		jsonObject.put(SEMS_ADDRESS, semsObject.getSemsAddress());
		jsonObject.put(TEXT, "[Error: object does not exist or access denied.]");
		return jsonObject;
	}
}
