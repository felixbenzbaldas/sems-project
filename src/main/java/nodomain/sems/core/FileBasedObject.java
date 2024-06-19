package nodomain.sems.core;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class FileBasedObject implements SemsObject {

    public static final String EXTENSION = ".json";

    private File file;
    private Map<String, Object> jsonMap;
    private ObjectMapper objectMapper = new ObjectMapper();

    public FileBasedObject(File file) {
        this.file = file;
        if (file.exists()) {
            Object json = null;
            try {
                json = objectMapper.readValue(file, Object.class);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
            jsonMap = (Map<String, Object>) json;
        } else {
            jsonMap = new HashMap<>();
        }
    }

    public FileBasedObject(File file, Map<String, Object> data) {
        this.file = file;
        setData(data);
    }

    @Override
    public String getName() {
        return file.getName().replace(EXTENSION, "");
    }

    @Override
    public Map<String, Object> getData() {
        return new HashMap<>(this.jsonMap);
    }

    @Override
    public boolean has(String property) {
        return this.jsonMap.containsKey(property);
    }

    public void set(String property, Object value) {
        Map<String, Object> newData = new HashMap<>(jsonMap); // copy
        newData.put(property, value);
        setData(newData);
    }

    private void setData(Map<String, Object> data) {
        try {
            objectMapper.writeValue(file, data);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        jsonMap = data;
    }

    @Override
    public Object get(String property) {
        return jsonMap.get(property);
    }
}
