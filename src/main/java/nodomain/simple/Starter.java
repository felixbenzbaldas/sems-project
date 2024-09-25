package nodomain.simple;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import nodomain.simple.core.AppA;
import nodomain.simple.test.AppA_TestA;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
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
            String command = args[0];
            switch (command) {
                case "test" -> test();
                case "deployAndRun" -> deployAndRun();
                case "publish" -> publish();
            }
        }
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

    static void deployAndRun() throws IOException {
        Entity entity = new Entity();
        entity.appA = new AppA(entity);
        Utils.runMultiplePlatformCommands("cd ./client", "npm run build");

        Utils.delete(new File(deploymentPath + "/heroku/sems/assets"));
        Utils.delete(new File(deploymentPath + "/heroku/sems/icon.png"));
        Utils.delete(new File(deploymentPath + "/heroku/sems/index.html"));
        Utils.delete(new File(deploymentPath + "/heroku/sems/diko-thesis-2017.pdf"));
        Utils.copyFolder(Path.of("client/dist"), Path.of(deploymentPath + "/heroku/sems"));

        String replacementPathImpressumHeader = deploymentPath + "/PUBLIC-replacement-impressum-header.txt";
        String replacementPathImpressumBody = deploymentPath + "/PUBLIC-replacement-impressum-body.txt";
        String replacementPathWebsite = deploymentPath + "/data/PUBLIC-replacement-website.txt";

        deployment_replace(replacementPathImpressumHeader, "marker-dr53hifhh4-impressum-header");
        deployment_replace(replacementPathImpressumBody, "marker-dr53hifhh4-impressum-body");
        deployment_replace_prettyJson(replacementPathWebsite, "marker-dr53hifhh4-website");

        Utils.runMultiplePlatformCommands(
            "start \"\" http://localhost:8086/?testMode",
            "start \"\" http://localhost:8086/?test",
            "start \"\" http://localhost:8086/?client-app"
        );
        Utils.runMultiplePlatformCommands(
            "cd " + deploymentPath + "/heroku/sems",
            "http-server --port 8086"
        );
    }

    private static void deployment_replace(String pathOfReplacement, String toReplace) throws IOException {
        String replacement = Utils.readFromFile(new File(pathOfReplacement));
        boolean found = false;
        for (File file : new File(deploymentPath + "/heroku/sems/assets").listFiles()) {
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

    private static void deployment_replace_prettyJson(String pathOfReplacement, String toReplace) throws IOException {
        Object json = new ObjectMapper().readValue(new File(pathOfReplacement), Object.class);
        String replacement = new ObjectMapper().writeValueAsString(json).replace("\"", "\\\"").replace("\\n", "\\\\n");
        boolean found = false;
        for (File file : new File(deploymentPath + "/heroku/sems/assets").listFiles()) {
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

    // login to heroku at first
    public static void publish() {
        Utils.runMultiplePlatformCommands(
            "cd " + new File(deploymentPath, "/heroku/sems"),
            "git add .",
            "git commit -am \"deployment\"",
            "git push heroku main"
        );
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

    public static Entity test() {
        Entity entity = new Entity();
        entity.appA = new AppA(entity);
        entity.appA.testA = new AppA_TestA(entity);
        entity.file = new File(Starter.PATH_FOR_TMP_FILES);
        entity.appA.testA.createRunAndDisplayTests();
        return entity;
    }
}
