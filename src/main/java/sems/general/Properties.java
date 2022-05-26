package sems.general;

import java.util.HashMap;
import java.util.Map;

import sems.App;

public class Properties {
	private Map<String, PropertiesOfIdentity> map = new HashMap<>();
	
	public PropertiesOfIdentity getPropertiesOfIdentity(String identity) {
		if (!map.containsKey(identity)) {
			map.put(identity, new PropertiesOfIdentity());
		}
		return map.get(identity);
	}

	public void setProperty(String identity, String property, Object value) {
		getPropertiesOfIdentity(identity).setProperty(property, value);
	}

	public String getString(String identity, String property) {
		return getPropertiesOfIdentity(identity).getString(property);
	}
	
	public Boolean getBoolean(String identity, String property) {
		return getPropertiesOfIdentity(identity).getBoolean(property);
	}
	
	public Object get(String identity, String property) {
		return getPropertiesOfIdentity(identity).get(property);
	}
}