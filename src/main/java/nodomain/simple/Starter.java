package nodomain.simple;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import nodomain.simple.core.AppA;
import nodomain.simple.test.AppA_TestA;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.text.SimpleDateFormat;
import java.util.Date;
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

    public void backup() throws IOException {
        Object backupConfig = JSONUtil.get(config, "backup");
        {
            Object staticConfig = JSONUtil.get(backupConfig, "static");
            Utils.copyDirectory(
                Path.of(JSONUtil.getString(staticConfig, "source")),
                Path.of(JSONUtil.getString(staticConfig, "target")),
                false);
        }
        {
            Object fullConfig = JSONUtil.get(backupConfig, "full");
            Path target = Path.of(JSONUtil.getString(fullConfig, "target"));
            String dateString = new SimpleDateFormat("yyMMdd_HH_mm_ss E").format(new Date());
            Path currentTarget = target.resolve(dateString);
            currentTarget.toFile().mkdir();
            Path source = Path.of(JSONUtil.getString(fullConfig, "source"));
            Utils.copyDirectory(source, currentTarget);
        }
        {
            Object gitConfig = JSONUtil.get(backupConfig, "git");
            String gitExe = JSONUtil.getString(gitConfig, "exe");
            String source = JSONUtil.getString(gitConfig, "source");
            String target = JSONUtil.getString(gitConfig, "target");
            Utils.runMultiplePlatformCommands(
                "cd \"" + source + "\"",
                "\"" + gitExe + "\" push --progress \"" + target + "\" main:main",
                "pause");
        }
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
