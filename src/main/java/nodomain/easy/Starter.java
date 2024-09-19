package nodomain.easy;


import java.io.File;
import java.io.IOException;
import java.util.List;

public class Starter {

    public static void main(String[] args) throws IOException {
    }

    public static Entity createApp() {
        Entity app = new Entity();
        app.text = "Sems application";
        return app;
    }

    public static Entity createApp(File file) {
        Entity app = new Entity();
        app.persistence_file = file;
        app.set("text", "Sems application (with file)");
        return app;
    }

    public static Entity loadApp(File file) {
        Entity app = new Entity();
        app.persistence_file = file;
        app.updateFromPersistence();
        return app;
    }

    public static Entity createOnlyLocalhostServer(File file, int port) {
        Entity app = new Entity();
        app.persistence_file = file;
        app.set("text", "Sems application (with file and OnlyLocalhostServer)");
        app.set("content", List.of());
        app.set("port", port);
        return app;
    }
}
