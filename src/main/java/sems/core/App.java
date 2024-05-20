package sems.core;

import java.io.File;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class App {

    private File file;

    private Map<String, House> houses = new HashMap<>();

    public App(File file) {
        this.file = file;
    }

    public Object handle(String method, List<Object> args) {
        switch (method) {
            case "createObjectWithText" :
                return createObjectWithText((List<String>) args.get(0), (String) args.get(1));
            case "createUser" :
                createUser((String) args.get(0), (String) args.get(1));
                return null;
            case "get" :
                return get((List<String>) args.get(0));
        }
        throw new RuntimeException("method not implemented");
    }

    public String createObjectWithText(List<String> house, String text) {
        return getHouse(PathUtil.fromList(house)).createObjectWithText(text).getName();
    }

    public Map<String, Object> get(List<String> path) {
        Path pathObj = PathUtil.fromList(path);
        String name = PathUtil.getName(pathObj);
        return getHouse(pathObj.getParent()).get(name).getData();
    }

    public void createUser(String user, String password) {
        getHouse(Path.of("users")).createUser(user, password);
    }
    private House getHouse(Path housePath) {
        if (housePath.getNameCount() == 1) {
            String houseName = housePath.getName(0).toString();
            if (!houses.containsKey(houseName)) {
                houses.put(houseName, new ObjectFilesHouse(new File(file, houseName)));
            }
            return houses.get(houseName);
        } else {
            throw new RuntimeException("not implemented yet");
        }

    }
}
