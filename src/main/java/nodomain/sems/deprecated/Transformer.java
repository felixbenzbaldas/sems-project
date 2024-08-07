package nodomain.sems.deprecated;

import com.fasterxml.jackson.databind.ObjectMapper;
import nodomain.sems.deprecated.core.ObjectFilesHouse;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class Transformer {

    public static void main(String[] args) throws IOException {
        new Transformer().transform(new File(args[0]), new File(args[1]));
    }

    private String house;

    public void transform(File inputHouseFile, File outputDirectory) throws IOException {
        house = getNameOfHouse(inputHouseFile);
        File houseDirectory = new File(outputDirectory, house);
        ObjectFilesHouse house = new ObjectFilesHouse(houseDirectory);
        Object houseObject = new ObjectMapper().readValue(inputHouseFile, Object.class);
        Map<String, Object> houseMap = (Map<String, Object>) houseObject;
        List<Object> objects = (List<Object>) houseMap.get("objects");
        for (Object object : objects) {
            transformObject(house, (Map<String, Object>) object);
        }
    }

    private String getNameOfHouse(File houseFile) {
        String fileName = houseFile.getName();
        return fileName.substring(2, fileName.length() - 5);
    }

    private void transformObject(ObjectFilesHouse house, Map<String, Object> object) throws IOException {
        String name = ((String) object.get("id")).split("-")[1];
        Map<String, Object> properties = (Map<String, Object>) object.get("properties");
        Map<String, Object> json = new HashMap<>();

        json.put("text", properties.get("text"));

        List<String> details = (List<String>) object.get("details");
        json.put("details", details.stream().map(id -> transformIdToPath(id)).collect(Collectors.toList()));
        house.createObject(name, json);
    }

    private List<String> transformIdToPath(String id) {
        String[] splitted = id.split("-");
        String idHouse = splitted[0];
        String name = splitted[1];
        return List.of(idHouse, name);
        //
        // TODO relative paths
//        if (this.house.equals(idHouse)) {
//            return List.of(name);
//        } else {
//            return List.of("..", idHouse, name);
//        }
    }
}