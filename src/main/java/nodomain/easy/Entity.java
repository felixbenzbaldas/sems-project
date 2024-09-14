package nodomain.easy;

import com.fasterxml.jackson.databind.ObjectMapper;
import nodomain.easy.core.ListAspect;
import nodomain.easy.core.RandomString;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Entity {

    public String name;
    public String text;
    public ListAspect list;
    public Map<String, Object> data = new HashMap<>();
    public Entity container;


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

    public int port;

    public Entity createList() {
        Entity entity = this.createEntity();
        entity.list = new ListAspect();
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
            loadedObjects.put(entity.name, entity);
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

    public Map<String, Entity> loadedObjects = new HashMap<>();

    public Entity containerAspect_getByName(String name) {
        if (!loadedObjects.containsKey(name)) {
            Entity entity = this.createEntity();
            entity.name = name;
            entity.container = this;
            loadedObjects.put(name, entity);
            entity.update();
        }
        return loadedObjects.get(name);
    }

    ////////////////////////////////////////////////////////////////////////
}