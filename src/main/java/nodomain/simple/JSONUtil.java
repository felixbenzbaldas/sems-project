package nodomain.simple;

import java.util.Map;

public class JSONUtil {
    public static Object get(Object json, String propertyName) {
        return ((Map<String, Object>) json).get(propertyName);
    }

    public static String getString(Object json, String propertyName) {
        return (String) ((Map<String, Object>) json).get(propertyName);
    }
}
