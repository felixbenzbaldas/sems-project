package nodomain.sems.deprecated.core;

import nodomain.sems.deprecated.Security;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

public class ObjectFilesHouse implements House {

    private File directoryFile;
    private Map<String, FileBasedObject> loadedObjects = new HashMap<>();

    public ObjectFilesHouse(File directoryFile) {
        this.directoryFile = directoryFile;
        this.directoryFile.mkdirs();
    }

    @Override
    public SemsObject createObjectWithText(String text) {
        return createObject(new RandomString().next(), Map.of("text", text));
    }

    @Override
    public SemsObject get(String name) {
        if (loadedObjects.containsKey(name)) {
            return loadedObjects.get(name);
        } else {
            File file = new File(directoryFile, name + FileBasedObject.EXTENSION);
            FileBasedObject fileBasedObject = new FileBasedObject(file);
            return fileBasedObject;
        }
    }

    @Override
    public SemsObject createUser(String userName, String password) {
        return createObject(userName, Map.of("hash", new Security().createSecurityHash(password)));
    }

    public FileBasedObject createObject(String name, Map<String, Object> data) {
        File file = new File(directoryFile, name + FileBasedObject.EXTENSION);
        FileBasedObject fileBasedObject = new FileBasedObject(file, data);
        loadedObjects.put(fileBasedObject.getName(), fileBasedObject);
        return fileBasedObject;
    }
}
