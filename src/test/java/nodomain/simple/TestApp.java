package nodomain.simple;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.File;
import java.io.IOException;

import static nodomain.simple.Starter.PATH_FOR_TMP_FILES;
import static org.assertj.core.api.Assertions.assertThat;

public class TestApp {


    @BeforeEach
    void beforeEach() {
        new File(PATH_FOR_TMP_FILES).mkdirs();
    }

    @Test
    void can_create_app_with_file() {
        File file = new File(PATH_FOR_TMP_FILES);

        Entity app = Starter.createApp(file);

        assertThat(app.file).isSameAs(file);
        assertThat(new File(file, "properties.json")).exists();
    }

    @Test
    void can_set_text() {
        File file = new File(PATH_FOR_TMP_FILES);
        Entity app = Starter.createApp(file);

        app.set("text", "my application");

        assertThat(app.text).isEqualTo("my application");
    }

    @Test
    void can_load_app() {
        File file = new File(PATH_FOR_TMP_FILES);
        Entity createdApp = Starter.createApp(file);
        createdApp.set("text", "my application");

        Entity loadedApp = Starter.loadApp(file);

        assertThat(loadedApp.text).isEqualTo("my application");
        assertThat(loadedApp.file).isSameAs(file);
    }

    @Test
    void can_create_object_with_text() {
        Entity app = Starter.createApp(new File(PATH_FOR_TMP_FILES));

        Entity entity = app.appA.createText("bar");

        assertThat(entity.text).isEqualTo("bar");
        // there should be only one entity for an object
        assertThat(entity).isSameAs(app.containerAspect_getByName(entity.name));
    }

    @Test
    void can_load_object_with_text() {
        String name = createObjectWithText("bar");
        Entity app = Starter.createApp(new File(PATH_FOR_TMP_FILES));

        Entity loaded = app.containerAspect_getByName(name);

        assertThat(loaded.text).isEqualTo("bar");
        // there should be only one entity for an object
        assertThat(loaded).isSameAs(app.containerAspect_getByName(loaded.name));
    }

    // returns the name of the created object
    private String createObjectWithText(String text) {
        Entity app = Starter.createApp(new File(PATH_FOR_TMP_FILES));
        Entity entity = app.appA.createText(text);
        return entity.name;
    }

    @AfterEach
    void afterEach() throws IOException {
        Utils.deleteDirectory(new File(PATH_FOR_TMP_FILES));
    }
}