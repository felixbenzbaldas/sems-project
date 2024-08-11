package nodomain.sems;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Comparator;

import static org.assertj.core.api.Assertions.assertThat;

public class TestApp {

    private static final String TEST_RESOURCES_PATH = "./src/test/resources";
    private static final String PATH_FOR_TMP_FILES = TEST_RESOURCES_PATH + "/tmp";

    @BeforeEach
    void beforeEach() {
        new File(PATH_FOR_TMP_FILES).mkdirs();
    }

    @Test
    void can_create_app_with_file() {
        File file = new File(PATH_FOR_TMP_FILES);

        Identity app = Starter.createApp(file);

        assertThat(app.file).isSameAs(file);
        assertThat(new File(file, "properties.json")).exists();
    }

    @Test
    void can_set_text() {
        File file = new File(PATH_FOR_TMP_FILES);
        Identity app = Starter.createApp(file);

        app.set("text", "my application");

        assertThat(app.text).isEqualTo("my application");
    }

    @Test
    void can_load_app() {
        File file = new File(PATH_FOR_TMP_FILES);
        Identity createdApp = Starter.createApp(file);
        createdApp.set("text", "my application");

        Identity loadedApp = Starter.loadApp(file);

        assertThat(loadedApp.text).isEqualTo("my application");
        assertThat(loadedApp.file).isSameAs(file);
    }

    @Test
    void can_create_object_with_text() {
        Identity app = Starter.createApp(new File(PATH_FOR_TMP_FILES));

        Identity identity = app.createText("bar");

        assertThat(identity.text).isEqualTo("bar");
        // there should be only one identity for an object
        assertThat(identity).isSameAs(app.containerAspect_getByName(identity.name));
    }

    @Test
    void can_load_object_with_text() {
        String name = createObjectWithText("bar");
        Identity app = Starter.createApp(new File(PATH_FOR_TMP_FILES));

        Identity loaded = app.containerAspect_getByName(name);

        assertThat(loaded.text).isEqualTo("bar");
        // there should be only one identity for an object
        assertThat(loaded).isSameAs(app.containerAspect_getByName(loaded.name));
    }

    // returns the name of the created object
    private String createObjectWithText(String text) {
        Identity app = Starter.createApp(new File(PATH_FOR_TMP_FILES));
        Identity identity = app.createText(text);
        return identity.name;
    }

    @AfterEach
    void afterEach() throws IOException {
        deleteDirectory(new File(PATH_FOR_TMP_FILES));
    }

    static private void deleteDirectory(File file) throws IOException {
        Files.walk(file.toPath()).sorted(Comparator.reverseOrder()).map(Path::toFile).forEach(File::delete);
    }
}