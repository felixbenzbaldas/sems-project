package nodomain.simple;


import com.fasterxml.jackson.databind.ObjectMapper;
import nodomain.simple.core.AppA;
import nodomain.simple.test.AppA_TestA;

import java.io.File;
import java.io.IOException;
import java.util.List;

public class Starter {
    public static final String TEST_RESOURCES_PATH = "./src/test/resources";
    public static final String PATH_FOR_TMP_FILES = TEST_RESOURCES_PATH + "/tmp";

    public Object config;

    public static void main(String[] args) throws Exception {
        new Starter().start(args);
    }

    public void start(String[] args) throws Exception {
        this.config = new ObjectMapper().readValue(new File(args[1]), Object.class);
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
        BackupA backupA = BackupA.createFromJson(backupConfig);
        backupA.run();
    }

    public String getDeploymentPath() {
        return JSONUtil.getString(this.config, "deploymentPath");
    };

    public void run() {
        Entity app = createDeployer(this.getDeploymentPath());
        app.appA.deployG.run();
    }

    void deployAndRun() throws IOException {
        Entity app = createDeployer(this.getDeploymentPath());
        app.appA.deployG.deployAndRun();
    }

    void replaceAndRun() throws IOException {
        Entity app = createDeployer(this.getDeploymentPath());
        app.appA.deployG.replaceAndRun();
    }

    public void publish() {
        Entity app = createDeployer(this.getDeploymentPath());
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
