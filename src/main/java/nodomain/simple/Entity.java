package nodomain.simple;

import com.fasterxml.jackson.databind.ObjectMapper;
import nodomain.simple.core.AppA;
import nodomain.simple.core.ListA;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class Entity {

    public String name;
    public String text;
    public ListA listA;
    public Map<String, Object> data = new HashMap<>();
    public Entity container;
    public AppA appA;
    public File file;

    public Entity() {
    }


    public void set(String property, Object value) {
        Map<String, Object> newData = new HashMap<>(data); // copy
        newData.put(property, value);
        if (hasPersistence()) {
            persistence_persist(newData);
        }
        data = newData;
        if (property.equals("text")) {
            text = (String) value;
        }
    }

    public void updateFromPersistence() {
        if (hasPersistence()) {
            data = persistence_getData();
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

    private ObjectMapper objectMapper = new ObjectMapper();

    public void persistence_persist(Map<String, Object> data) {
        File propertiesFile = persistence_getPropertiesFile();
        propertiesFile.getParentFile().mkdirs();
        try {
            objectMapper.writeValue(propertiesFile, data);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public Map<String, Object> persistence_getData() {
        try {
            return (Map<String, Object>) objectMapper.readValue(persistence_getPropertiesFile(), Object.class);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public File persistence_getPropertiesFile() {
        return new File(persistence_getFile(), "properties.json");
    }

    public File persistence_getFile() {
        if (file == null) {
            return new File(container.persistence_getFile(), "objects/" + name);
        } else {
            return file;
        }
    }

    ////////////////////////////////////////////////////////////////////////
    // container aspect

    public Map<String, Entity> mapStringEntity = new HashMap<>();

    public Entity containerAspect_getByName(String name) {
        if (!mapStringEntity.containsKey(name)) {
            Entity entity = this.appA.createEntity();
            entity.name = name;
            entity.container = this;
            mapStringEntity.put(name, entity);
            entity.updateFromPersistence();
        }
        return mapStringEntity.get(name);
    }
}