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

    public static String deploymentPath;

    public static void main(String[] args) throws IOException {
        deploymentPath = getProperty("deploymentPath");
        System.out.println("deploymentPath " + deploymentPath);
        if (args.length > 0) {
            if (args[0].contains(",")) {
                args = args[0].split(",");
            }
            String method = args[0];
            switch (method) {
                case "test" -> test();
                case "run" -> run();
                case "deployAndRun" -> deployAndRun();
                case "replaceAndRun" -> replaceAndRun();
                case "publish" -> publish();
            }
        }
    }

    public static void run() {
        Entity app = createDeployer(deploymentPath);
        app.appA.deployG.run();
    }

    static void deployAndRun() throws IOException {
        Entity app = createDeployer(deploymentPath);
        app.appA.deployG.deployAndRun();
    }

    static void replaceAndRun() throws IOException {
        Entity app = createDeployer(deploymentPath);
        app.appA.deployG.replaceAndRun();
    }

    // login to heroku at first
    public static void publish() {
        Entity app = createDeployer(deploymentPath);
        app.appA.deployG.publish();
    }

    public static String getProperty(String key) {
        try {
            Map<String, Object> properties = (java.util.Map<String, Object>) new ObjectMapper().readValue(getConfigFile(), Object.class);
            return (String) properties.get(key);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public static File getConfigFile() {
        return new File(Config.pathToConfigFile);
    }

    public static Entity createApp() {
        Entity app = new Entity();
        app.appA = new AppA(app);
        app.text = "Sems application";
        return app;
    }

    public static Entity createApp(File file) {
        Entity app = new Entity();
        app.appA = new AppA(app);
        app.file = file;
        app.set("text", "Sems application (with file)");
        return app;
    }

    public static Entity loadApp(File file) {
        Entity app = new Entity();
        app.appA = new AppA(app);
        app.file = file;
        app.updateFromPersistence();
        return app;
    }

    public static Entity createOnlyLocalhostServer(File file, int port) {
        Entity app = new Entity();
        app.appA = new AppA(app);
        app.file = file;
        app.set("text", "Sems application (with file and OnlyLocalhostServer)");
        app.set("content", List.of());
        app.set("port", port);
        return app;
    }

    public static Entity createDeployer(String deploymentPath) {
        Entity app = new Entity();
        app.appA = new AppA(app);
        app.appA.deployG.path = deploymentPath;
        return app;
    }

    public static void test() {
        Entity entity = new Entity();
        entity.appA = new AppA(entity);
        entity.appA.testA = new AppA_TestA(entity);
        entity.file = new File(Starter.PATH_FOR_TMP_FILES);
        entity.appA.testA.createRunAndDisplayTests();
    }
}
