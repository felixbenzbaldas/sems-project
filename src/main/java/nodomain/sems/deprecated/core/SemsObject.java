package nodomain.sems.deprecated.core;

import java.util.Map;

public interface SemsObject {
    Object get(String property);
    void set(String property, Object value);
    String getName();
    Map<String, Object> getData();
    boolean has(String property);
}
