package sems.general;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

public class PropertiesOfIdentity {
	private Map<String, Object> map = new HashMap<>();
	
	public void setProperty(String property, Object value) {
		map.put(property, value);
	}
	
	public String getString(String property) {
		return (String) map.get(property);
	}
	
	public Boolean getBoolean(String property) {
		return (Boolean) map.get(property);
	}
	
	public Object get(String property) {
		return map.get(property);
	}
	
	public Set<String> getProperties() {
		return map.keySet();
	}
	
	public void clear() {
		map = new HashMap<>();
	}
}