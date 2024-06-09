package nodomain.sems.core;

import nodomain.sems.Security;

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
        RandomString randomString = new RandomString();
        File file = new File(directoryFile, randomString.next() + FileBasedObject.EXTENSION);
        FileBasedObject fileBasedObject = new FileBasedObject(file);
        fileBasedObject.set("text", text);
        loadedObjects.put(fileBasedObject.getName(), fileBasedObject);
        return fileBasedObject;
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
        File file = new File(directoryFile, userName + FileBasedObject.EXTENSION);
        FileBasedObject fileBasedObject = new FileBasedObject(file);
        fileBasedObject.set("hash", new Security().createSecurityHash(password));
        loadedObjects.put(fileBasedObject.getName(), fileBasedObject);
        return fileBasedObject;
    }
}
