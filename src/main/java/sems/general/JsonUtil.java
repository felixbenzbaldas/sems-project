package sems.general;

import java.util.List;
import java.util.Map;

public class JsonUtil {

	public static int getInt(Map<String, Object> jsonObject, String key) {
		return (int) jsonObject.get(key);
	}

	public static String getString(Map<String, Object> jsonObject, String key) {
		Object value = jsonObject.get(key);
		if (value == null) {
			return null;
		} else if (value instanceof String) {
			return (String) value;
		} else {
			return String.valueOf(value);
		}
	}
	
	public static Boolean getBoolean(Map<String, Object> jsonObject, String key) {
		return (Boolean) jsonObject.get(key);
	}
	
	public static List<Object> getList(Map<String, Object> jsonObject, String key) {
		return (List<Object>) jsonObject.get(key);
	}
}
