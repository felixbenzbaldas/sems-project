package nodomain.easy;

import nodomain.easy.deprecated.OnlyLocalhostServer;

import java.io.File;
import java.io.IOException;
import java.util.List;

public class Starter {

    public static void main(String[] args) throws IOException {
        runDeprecatedServer(args);
    }

    private static void runDeprecatedServer(String[] args) throws IOException {
        OnlyLocalhostServer.main(args);
    }

    public static Entity createApp() {
        Entity app = new Entity();
        app.text = "Sems application";
        return app;
    }

    public static Entity createApp(File file) {
        Entity app = new Entity();
        app.file = file;
        app.set("text", "Sems application (with file)");
        return app;
    }

    public static Entity loadApp(File file) {
        Entity app = new Entity();
        app.file = file;
        app.update();
        return app;
    }

    public static Entity createOnlyLocalhostServer(File file, int port) {
        Entity app = new Entity();
        app.file = file;
        app.set("text", "Sems application (with file and OnlyLocalhostServer)");
        app.set("content", List.of());
        app.set("port", port);
        return app;
    }
}
