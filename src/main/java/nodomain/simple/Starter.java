package nodomain.simple;


import nodomain.simple.core.AppA;
import nodomain.simple.test.AppA_TestA;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
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
                test();
            } else if ("deploy".equals(command)) {
                deploy(args[1]);
            }
        }
    }

    static void deploy(String deploymentPath) {
        System.out.println("deploymentPath " + deploymentPath);
        Entity entity = new Entity();
        entity.appA = new AppA(entity);
        try {
            Utils.runMultiplePlatformCommands("cd ./client", "npm run build");

            Utils.delete(new File(deploymentPath + "/heroku/sems/assets"));
            Utils.delete(new File(deploymentPath + "/heroku/sems/icon.png"));
            Utils.delete(new File(deploymentPath + "/heroku/sems/index.html"));
            Utils.delete(new File(deploymentPath + "/heroku/sems/diko-thesis-2017.pdf"));
            Utils.copyFolder(Path.of("client/dist"), Path.of(deploymentPath + "/heroku/sems"));

            String replacementPathAboutHeader = deploymentPath + "/PUBLIC-replacement-about-header.txt";
            String replacementPathAboutBody = deploymentPath + "/PUBLIC-replacement-about-body.txt";
            String replacementPathImpressumHeader = deploymentPath + "/PUBLIC-replacement-impressum-header.txt";
            String replacementPathImpressumBody = deploymentPath + "/PUBLIC-replacement-impressum-body.txt";
            String replacementPathWebsite = deploymentPath + "/PUBLIC-replacement-website.txt";

            deployment_replace(deploymentPath, replacementPathAboutHeader, "marker-dr53hifhh4-about-header");
            deployment_replace(deploymentPath, replacementPathAboutBody, "marker-dr53hifhh4-about-body");
            deployment_replace(deploymentPath, replacementPathImpressumHeader, "marker-dr53hifhh4-impressum-header");
            deployment_replace(deploymentPath, replacementPathImpressumBody, "marker-dr53hifhh4-impressum-body");
            deployment_replace(deploymentPath, replacementPathWebsite, "marker-dr53hifhh4-website");
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private static void deployment_replace(String deploymentPath, String pathOfReplacement, String toReplace) throws IOException {
        String replacement = Utils.readFromFile(new File(pathOfReplacement)).replace("\n", "\\n");
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
