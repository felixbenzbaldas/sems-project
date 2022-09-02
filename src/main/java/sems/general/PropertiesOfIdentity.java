package sems.general;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;

public class PropertiesOfIdentity {
	private Map<String, Object> map = new HashMap<>();
	public Function<?, ?> onChanged;
	
	public void setProperty(String property, Object value) {
		boolean changed;
		if (value == null) {
			changed = map.get(property) != null;
		} else {
			changed = !value.equals(map.get(property));
		}
		map.put(property, value);
		if (changed) {
			callOnChanged();
		}
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
		callOnChanged();
	}
	
	private void callOnChanged() {
		if (onChanged != null) {
			onChanged.apply(null);
		}
	}
}