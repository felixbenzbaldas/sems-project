package sems.core;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

public class App {

    private File file;

    private Map<String, House> houses = new HashMap<>();

    public App(File file) {
        this.file = file;
    }

    public Object handle(String method, Map<String, Object> parameters) {
        switch (method) {
            case "createObjectWithText" :
                return createObjectWithText((String) parameters.get("house"), (String) parameters.get("text"));
            case "createUser" :
                createUser((String) parameters.get("user"), (String) parameters.get("password"));
                return null;
            case "get" :
                return get((String) parameters.get("house"), (String) parameters.get("name"));
        }
        throw new RuntimeException("method not implemented");
    }


    public String createObjectWithText(String house, String text) {
        return getHouse(house).createObjectWithText(text).getName();
    }

    public Map<String, Object> get(String house, String name) {
        return getHouse(house).get(name).getData();
    }

    public void createUser(String user, String password) {
        getHouse("users").createUser(user, password);
    }

    private House getHouse(String houseName) {
        if (!houses.containsKey(houseName)) {
            houses.put(houseName, new ObjectFilesHouse(new File(file, houseName)));
        }
        return houses.get(houseName);
    }
}
