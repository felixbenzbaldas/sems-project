package nodomain.simple;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import nodomain.simple.core.AppA;
import nodomain.simple.test.AppA_TestA;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;

public class Starter {
    public static final String TEST_RESOURCES_PATH = "./src/test/resources";
    public static final String PATH_FOR_TMP_FILES = TEST_RESOURCES_PATH + "/tmp";

    public String deploymentPath;
    public Map<String, Object> config;

    public static void main(String[] args) throws IOException {
        new Starter().start(args);
    }

    public void start(String[] args) throws IOException {
        try {
            this.config = (Map<String, Object>) new ObjectMapper().readValue(new File(args[1]), Object.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        deploymentPath = (String) config.get("deploymentPath");
        String method = args[0];
        switch (method) {
            case "test" -> test();
            case "run" -> run();
            case "deployAndRun" -> deployAndRun();
            case "replaceAndRun" -> replaceAndRun();
            case "publish" -> publish();
            case "backup" -> backup();
        }
    }

    public void backup() {
        Map<String, Object> backupConfig = (Map<String, Object>) config.get("backup");
        System.out.println(backupConfig.get("static"));
    }

    public void run() {
        Entity app = createDeployer(deploymentPath);
        app.appA.deployG.run();
    }

    void deployAndRun() throws IOException {
        Entity app = createDeployer(deploymentPath);
        app.appA.deployG.deployAndRun();
    }

    void replaceAndRun() throws IOException {
        Entity app = createDeployer(deploymentPath);
        app.appA.deployG.replaceAndRun();
    }

    public void publish() {
        Entity app = createDeployer(deploymentPath);
        app.appA.deployG.publish();
    }

    public Entity createApp() {
        Entity app = new Entity();
        app.appA = new AppA(app);
        app.text = "Sems application";
        return app;
    }

    public Entity createApp(File file) {
        Entity app = new Entity();
        app.appA = new AppA(app);
        app.file = file;
        app.set("text", "Sems application (with file)");
        return app;
    }

    public Entity loadApp(File file) {
        Entity app = new Entity();
        app.appA = new AppA(app);
        app.file = file;
        app.updateFromPersistence();
        return app;
    }

    public Entity createOnlyLocalhostServer(File file, int port) {
        Entity app = new Entity();
        app.appA = new AppA(app);
        app.file = file;
        app.set("text", "Sems application (with file and OnlyLocalhostServer)");
        app.set("content", List.of());
        app.set("port", port);
        return app;
    }

    public Entity createDeployer(String deploymentPath) {
        Entity app = new Entity();
        app.appA = new AppA(app);
        app.appA.deployG.path = deploymentPath;
        return app;
    }

    public void test() {
        Entity entity = new Entity();
        entity.appA = new AppA(entity);
        entity.appA.testA = new AppA_TestA(entity);
        entity.file = new File(Starter.PATH_FOR_TMP_FILES);
        entity.appA.testA.createRunAndDisplayTests();
    }
}
