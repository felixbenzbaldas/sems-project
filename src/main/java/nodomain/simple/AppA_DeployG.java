package nodomain.simple;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;

public class AppA_DeployG {
    private Entity entity;

    public String path;

    public AppA_DeployG(Entity entity) {
        this.entity = entity;
    }

    public void deployAndRun() throws IOException {
        this.deleteOldFiles();
        this.buildClient();
        this.copy();
        this.replace();
        this.run();
    }
    public void replaceAndRun() throws IOException {
        this.deleteOldFiles();
        this.copy();
        this.replace();
        this.run();
    }

    public void copy() throws IOException {
        Utils.copyDirectory(Path.of("client/dist"), Path.of(this.path + "/heroku/sems"));
    }

    private void deleteOldFiles() throws IOException {
        Utils.delete(new File(this.path + "/heroku/sems/assets"));
        Utils.delete(new File(this.path + "/heroku/sems/icon.png"));
        Utils.delete(new File(this.path + "/heroku/sems/index.html"));
        Utils.delete(new File(this.path + "/heroku/sems/diko-thesis-2017.pdf"));
    }

    private void buildClient() {
        Utils.runMultiplePlatformCommands("cd ./client", "npm run build");
        // TODO: wait until build has finished
        try {
            Thread.sleep(6000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    public void replace() throws IOException {
        this.replace(this.path + "/data/PUBLIC-replacement-website.txt",
            "marker-dr53hifhh4-website");
    }

    public void replace(String pathOfReplacement, String toReplace) throws IOException {
        Object json = new ObjectMapper().readValue(new File(pathOfReplacement), Object.class);
        String jsonString = new ObjectMapper().writeValueAsString(json);
        String replacement = this.entity.appA.escapeJsonString(jsonString);
        boolean found = false;
        for (File file : new File(this.path + "/heroku/sems/assets").listFiles()) {
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

    public void run() {
        Utils.runMultiplePlatformCommands(
            "start \"\" http://localhost:8086/?virtualHostname=einfaches-web.org",
            "start \"\" http://localhost:8086/?test",
            "start \"\" http://localhost:8086"
        );
        Utils.runMultiplePlatformCommands(
            "cd " + this.path + "/heroku/sems",
            "http-server --port 8086"
        );
    }

    // login to heroku at first
    public void publish() {
        Utils.runMultiplePlatformCommands(
            "cd " + new File(this.path, "/heroku/sems"),
            "git add .",
            "git commit -am \"deployment\"",
            "git push heroku main"
        );
    }
}
