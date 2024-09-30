package nodomain.simple.core;

import nodomain.simple.Entity;
import nodomain.simple.test.AppA_TestA;

import java.util.List;

public class AppA {

    public AppA_TestA testA;
    private Entity entity;

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

    public String escapeJsonString(String jsonString) {
        return jsonString
            .replace("\"", "\\\"")
            .replace("\\\\\"", "\\\\\\\"")
            .replace("\\n", "\\\\n");
    }
}