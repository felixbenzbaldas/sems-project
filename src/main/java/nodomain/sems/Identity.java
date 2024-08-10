package nodomain.sems;

import com.fasterxml.jackson.databind.ObjectMapper;
import nodomain.sems.core.ListAspect;
import nodomain.sems.deprecated.core.RandomString;

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
    public Identity container;


    public void set(String property, Object value) {
        Map<String, Object> newData = new HashMap<>(data); // copy
        newData.put(property, value);
        if (hasPersistence()) {
            persist(newData);
        }
        data = newData;
        if (property.equals("text")) {
            text = (String) value;
        }
    }

    public void update() {
        if (hasPersistence()) {
            data = getDataFromPersistence();
            if (data.containsKey("text")) {
                text = (String) data.get("text");
            } else {
                text = null;
            }
        }
    }

    public boolean hasPersistence() {
        return file != null || container != null && container.hasPersistence();
    }

    ////////////////////////////////////////////////////////////////////////
    // persistence aspect

    public File file;

    private ObjectMapper objectMapper = new ObjectMapper();

    public void persist(Map<String, Object> data) {
        File propertiesFile = getPropertiesFile();
        propertiesFile.getParentFile().mkdirs();
        try {
            objectMapper.writeValue(propertiesFile, data);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public Map<String, Object> getDataFromPersistence() {
        try {
            return (Map<String, Object>) objectMapper.readValue(getPropertiesFile(), Object.class);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public File getPropertiesFile() {
        return new File(getFile(), "properties.json");
    }

    public File getFile() {
        if (file == null) {
            return new File(container.getFile(), "objects/" + name);
        } else {
            return file;
        }
    }

    ////////////////////////////////////////////////////////////////////////
    // app aspect

    public Identity createList() {
        Identity identity = this.createIdentity();
        identity.list = new ListAspect();
        return identity;
    }

    public Identity createIdentity() {
        return new Identity();
    }

    public Identity createText(String text) {
        Identity identity = this.createIdentity();
        identity.text = text;
        if (hasPersistence()) {
            identity.name = new RandomString().next();
            identity.container = this;
            identity.set("text", text);
        }
        return identity;
    }

    public Identity get(String name) {
        Identity identity = this.createIdentity();
        identity.name = name;
        identity.container = this;
        identity.update();
        return identity;
    }
    ////////////////////////////////////////////////////////////////////////

}
