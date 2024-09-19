package nodomain.easy;

import com.fasterxml.jackson.databind.ObjectMapper;
import nodomain.easy.core.ListA;
import nodomain.easy.core.RandomString;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Entity {

    public String name;
    public String text;
    public ListA listA;
    public Map<String, Object> data = new HashMap<>();
    public Entity container;


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
        return persistence_file != null || container != null && container.hasPersistence();
    }

    ////////////////////////////////////////////////////////////////////////
    // persistence aspect

    public File persistence_file;

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
        if (persistence_file == null) {
            return new File(container.persistence_getFile(), "objects/" + name);
        } else {
            return persistence_file;
        }
    }

    ////////////////////////////////////////////////////////////////////////
    // app aspect

    public int port;

    public Entity createList() {
        Entity entity = this.createEntity();
        entity.listA = new ListA();
        return entity;
    }

    public Entity createEntity() {
        return new Entity();
    }

    public Entity createText(String text) {
        Entity entity = this.createEntity();
        if (hasPersistence()) {
            entity.name = new RandomString().next();
            entity.container = this;
            mapStringEntity.put(entity.name, entity);
            entity.set("text", text);
        } else {
            entity.text = text;
        }
        return entity;
    }

    // ols = OnlyLocalhostServer
    public void olsAspect_reset() {
        set("content", List.of());
    }

    // returns the name
    public String olsAspect_createText(List<String> pathOfContainer, String text) {
        if (pathOfContainer.isEmpty()) {
            Entity entity = this.createText(text);
            return entity.name;
        } else {
            throw new RuntimeException("not implemented yet");
        }
    }
    ////////////////////////////////////////////////////////////////////////
    // container aspect

    public Map<String, Entity> mapStringEntity = new HashMap<>();

    public Entity containerAspect_getByName(String name) {
        if (!mapStringEntity.containsKey(name)) {
            Entity entity = this.createEntity();
            entity.name = name;
            entity.container = this;
            mapStringEntity.put(name, entity);
            entity.updateFromPersistence();
        }
        return mapStringEntity.get(name);
    }

    ////////////////////////////////////////////////////////////////////////
}