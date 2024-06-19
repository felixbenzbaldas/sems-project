package nodomain.sems.core;

import nodomain.sems.Path;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class App {

    public static final String WORKING_PLACE = "workingPlace";
    private File file;

    private Map<String, House> houses = new HashMap<>();

    private SemsObject properties;

    public App(File file) {
        this.file = file;
        this.properties = new FileBasedObject(new File(this.file, "properties.json"));
        if (!this.properties.has(WORKING_PLACE)) {
            this.properties.set(WORKING_PLACE, new ArrayList<String>());
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
            case "addObjectToWorkingPlace" -> {
                this.addObjectToWorkingPlace((List<String>) args.get(0));
                yield null;
            }
            case "getObjectsInWorkingPlace" -> getObjectsInWorkingPlace();
            case "setText" -> {
                setText((List<String>) args.get(0), (String) args.get(1));
                yield null;
            }
            case "clearWorkingPlace" -> {
                this.clearWorkingPlace();
                yield null;
            }
            case "set" -> {
                this.set((List<String>) args.get(0), (String) args.get(1), args.get(2));
                yield null;
            }
            default -> throw new RuntimeException("method not implemented");
        };
    }

    public void setText(List<String> object, String text) {
        getSemsObject(new Path(object)).set("text", text);
    }

    public void set(List<String> object, String property, Object value) {
        getSemsObject(new Path(object)).set(property, value);
    }

    public String createObjectWithText(List<String> house, String text) {
        return getHouse(new Path(house)).createObjectWithText(text).getName();
    }
    public void addObjectToWorkingPlace(List<String> object) {
        List<List<String>> objectsInWorkingPlace = (List<List<String>>) this.properties.get(WORKING_PLACE);
        objectsInWorkingPlace.add(object);
        this.properties.set(WORKING_PLACE, objectsInWorkingPlace);
    }

    public List<List<String>> getObjectsInWorkingPlace() {
        return (List<List<String>>) this.properties.get(WORKING_PLACE);
    }

    public Map<String, Object> get(List<String> path) {
        return getSemsObject(new Path(path)).getData();
    }


    private SemsObject getSemsObject(Path path) {
        if (path.getLength() == 0) {
            return this.properties;
        } else {
            return getHouse(path.withoutLastPart()).get(path.getLastPart());
        }
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

    public void clearWorkingPlace() {
        this.properties.set(WORKING_PLACE, new ArrayList<String>());
    }
}
