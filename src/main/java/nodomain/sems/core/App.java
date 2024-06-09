package nodomain.sems.core;

import nodomain.sems.Path;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class App {

    public static final String WORKING_SPACE = "workingSpace";
    private File file;

    private Map<String, House> houses = new HashMap<>();

    private SemsObject properties;

    public App(File file) {
        this.file = file;
        this.properties = new FileBasedObject(new File(this.file, "properties.json"));
        if (!this.properties.has(WORKING_SPACE)) {
            this.properties.set(WORKING_SPACE, new ArrayList<String>());
        }
    }

    public Object handle(String method, List<Object> args) {
        return switch (method) {
            case "createObjectWithText" -> createObjectWithText((List<String>) args.get(0), (String) args.get(1));
            case "createUser" -> {
                createUser((String) args.get(0), (String) args.get(1));
                yield null;
            }
            case "get" -> get((List<String>) args.get(0));
            case "addObjectToWorkingSpace" -> {
                this.addObjectToWorkingSpace((List<String>) args.get(0));
                yield null;
            }
            case "getObjectsInWorkingPlace" -> getObjectsInWorkingPlace();
            case "setText" -> {
                setText((List<String>) args.get(0), (String) args.get(1));
                yield null;
            }
            case "clearWorkingSpace" -> {
                this.clearWorkingSpace();
                yield null;
            }
            default -> throw new RuntimeException("method not implemented");
        };
    }

    public void setText(List<String> object, String text) {
        getSemsObject(new Path(object)).set("text", text);
    }

    public String createObjectWithText(List<String> house, String text) {
        return getHouse(new Path(house)).createObjectWithText(text).getName();
    }
    public void addObjectToWorkingSpace(List<String> object) {
        List<List<String>> objectsInWorkingSpace = (List<List<String>>) this.properties.get(WORKING_SPACE);
        objectsInWorkingSpace.add(object);
        this.properties.set(WORKING_SPACE, objectsInWorkingSpace);
    }

    public List<List<String>> getObjectsInWorkingPlace() {
        return (List<List<String>>) this.properties.get(WORKING_SPACE);
    }

    public Map<String, Object> get(List<String> path) {
        return getSemsObject(new Path(path)).getData();
    }

    private SemsObject getSemsObject(Path path) {
        return getHouse(path.withoutLastPart()).get(path.getLastPart());
    }

    public void createUser(String user, String password) {
        getHouse(new Path(List.of("users"))).createUser(user, password);
    }
    private House getHouse(Path housePath) {
        if (housePath.getLength() == 1) {
            String houseName = housePath.getLastPart();
            if (!houses.containsKey(houseName)) {
                houses.put(houseName, new ObjectFilesHouse(new File(file, houseName)));
            }
            return houses.get(houseName);
        } else {
            throw new RuntimeException("not implemented yet");
        }
    }

    public void clearWorkingSpace() {
        this.properties.set(WORKING_SPACE, new ArrayList<String>());
    }
}
