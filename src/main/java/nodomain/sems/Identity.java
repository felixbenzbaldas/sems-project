package nodomain.sems;

import com.fasterxml.jackson.databind.ObjectMapper;
import nodomain.sems.core.ListAspect;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * An identity is an object without members. It only consists of its memory address.
 * The members of this class should be interpreted as aspects which can be assigned to the identity.
 * On the logical level they do not belong to this class.
 **/
public class Identity {

    public String name;
    public String text;
    public ListAspect list;
    public Map<String, Object> data = new HashMap<>();


    public void set(String property, Object value) {
        Map<String, Object> newData = new HashMap<>(data); // copy
        newData.put(property, value);
        persist(newData);
        data = newData;
        if (property.equals("text")) {
            text = (String) value;
        }
    }

    public void update() {
        data = getDataFromPersistence();
        if (data.containsKey("text")) {
            text = (String) data.get("text");
        } else {
            text = null;
        }
    }

    ////////////////////////////////////////////////////////////////////////
    // persistence aspect

    private ObjectMapper objectMapper = new ObjectMapper();

    public void persist(Map<String, Object> data) {
        if (file != null) {
            try {
                objectMapper.writeValue(getPropertiesFile(), data);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
    }

    public Map<String, Object> getDataFromPersistence() {
        if (file == null) {
            return data;
        } else {
            try {
                return (Map<String, Object>) objectMapper.readValue(getPropertiesFile(), Object.class);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
    }

    private File getPropertiesFile() {
        if (file == null) throw new RuntimeException();
        return new File(file, "properties.json");
    }

    ////////////////////////////////////////////////////////////////////////
    // app aspect

    public File file;

    public Identity createList() {
        Identity identity = this.createIdentitiy();
        identity.list = new ListAspect();
        return identity;
    }

    private Identity createIdentitiy() {
        return new Identity();
    }

    public Identity createText(String text) {
        Identity identity = this.createIdentitiy();
        identity.text = text;
        return identity;
    }

    public Identity get(String name) {
        return null;
    }
    ////////////////////////////////////////////////////////////////////////

}
