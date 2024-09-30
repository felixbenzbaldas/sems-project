package nodomain.simple.core;

import com.fasterxml.jackson.databind.ObjectMapper;
import nodomain.simple.Entity;
import nodomain.simple.Utils;
import nodomain.simple.test.AppA_TestA;

import java.io.File;
import java.io.IOException;
import java.util.List;

public class AppA {

    private Entity entity;
    public AppA_TestA testA;
    public String deployment_path;

    public AppA(Entity entity) {
        this.entity = entity;
    }

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
        if (this.entity.hasPersistence()) {
            entity.name = new RandomString().next();
            entity.container = this.entity;
            this.entity.mapStringEntity.put(entity.name, entity);
            entity.set("text", text);
        } else {
            entity.text = text;
        }
        return entity;
    }

    // ols = OnlyLocalhostServer
    public void olsAspect_reset() {
        this.entity.set("content", List.of());
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

    public void deployment_replace_prettyJson(String pathOfReplacement, String toReplace) throws IOException {
        Object json = new ObjectMapper().readValue(new File(pathOfReplacement), Object.class);
        String jsonString = new ObjectMapper().writeValueAsString(json);
        String replacement = jsonString.replace("\"", "\\\"").replace("\\n", "\\\\n");
        boolean found = false;
        for (File file : new File(this.deployment_path + "/heroku/sems/assets").listFiles()) {
            String oldText = Utils.readFromFile(file);
            if (oldText.contains(toReplace)) {
                found = true;
            }
            Utils.writeToFile(file, oldText.replace(toReplace, replacement));
        }
        if (!found) {
            throw new RuntimeException("replace was not successful!");
        }
    }

    public String escapeJsonString(String jsonString) {
        return jsonString
            .replace("\"", "\\\"")
            .replace("\\\\\"", "\\\\\\\"")
            .replace("\\n", "\\\\n");
    }
}