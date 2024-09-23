package nodomain.simple;


import nodomain.simple.core.AppA;
import nodomain.simple.test.AppA_TestA;

import java.io.File;
import java.io.IOException;
import java.util.List;

public class Starter {
    public static final String TEST_RESOURCES_PATH = "./src/test/resources";
    public static final String PATH_FOR_TMP_FILES = TEST_RESOURCES_PATH + "/tmp";

    public static void main(String[] args) throws IOException {
        if (args.length > 0) {
            if (args[0].contains(",")) {
                args = args[0].split(",");
            }
            String command = args[0];
            if ("test".equals(command)) {
                createTester();
            } else if ("deploy".equals(command)) {
                createDeployer(args[1]);
            }
        }
    }

    static void createDeployer(String deploymentPath) {
        System.out.println("deploymentPath " + deploymentPath);
        Entity entity = new Entity();
        entity.appA = new AppA(entity);
        try {
            Utils.delete(new File(deploymentPath + "/heroku/sems/assets"));
            Utils.delete(new File(deploymentPath + "/heroku/sems/icon.png"));
            Utils.delete(new File(deploymentPath + "/heroku/sems/index.html"));
            Utils.delete(new File(deploymentPath + "/heroku/sems/diko-thesis-2017.pdf"));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
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

    public static Entity createTester() {
        Entity entity = new Entity();
        entity.appA = new AppA(entity);
        entity.appA.testA = new AppA_TestA(entity);
        entity.file = new File(Starter.PATH_FOR_TMP_FILES);
        entity.appA.testA.createRunAndDisplayTests();
        return entity;
    }
}
