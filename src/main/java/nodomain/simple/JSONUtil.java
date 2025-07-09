package nodomain.simple;

import java.util.List;
import java.util.Map;

public class JSONUtil {
    public static Object get(Object json, String propertyName) {
        return ((Map<String, Object>) json).get(propertyName);
    }

    public static String getString(Object json, String propertyName) {
        return (String) ((Map<String, Object>) json).get(propertyName);
    }

    public static List<Object> getList(Object json, String propertyName) {
        return (List<Object>) ((Map<String, Object>) json).get(propertyName);
    }

    public static boolean has(Object json, String propertyName) {
        return ((Map<String, Object>) json).containsKey(propertyName);
    }
}
