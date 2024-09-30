package nodomain.simple;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.File;
import java.io.IOException;
import java.util.List;

import static nodomain.simple.Starter.PATH_FOR_TMP_FILES;
import static org.assertj.core.api.Assertions.assertThat;

public class TestOnlyLocalhostServer {

    @BeforeEach
    void beforeEach() {
        new File(PATH_FOR_TMP_FILES).mkdirs();
    }

    @Test
    void can_create_onlyLocalhostServer() {
        File file = new File(PATH_FOR_TMP_FILES);

        Entity onlyLocalhostServer = Starter.createOnlyLocalhostServer(file, 8085);

        assertThat(onlyLocalhostServer.data.get("port")).isEqualTo(8085);
        assertThat((List<List<String>>) onlyLocalhostServer.data.get("content")).isEmpty();
        assertThat(onlyLocalhostServer.file).isSameAs(file);
    }

    @Test
    void can_load_onlyLocalhostServer() {
        File file = new File(PATH_FOR_TMP_FILES);
        Entity app = Starter.createOnlyLocalhostServer(file, 8087);
        app.set("content", "some content");

        Entity loaded = Starter.loadApp(file);

        assertThat(loaded.data.get("port")).isEqualTo(8087);
        assertThat(loaded.data.get("content")).isEqualTo("some content");
        assertThat(loaded.file).isSameAs(file);
    }

    @Test
    void can_reset() {
        File file = new File(PATH_FOR_TMP_FILES);
        Entity app = Starter.createOnlyLocalhostServer(file, 8087);
        app.set("content", "bar");
        assertThat(app.data.get("content")).isEqualTo("bar");

        app.appA.onlyLocalhostServer_reset();

        assertThat((List<List<String>>) app.data.get("content")).isEmpty();
        Entity reloaded = Starter.loadApp(file);
        assertThat((List<List<String>>) reloaded.data.get("content")).isEmpty();
    }

    @Test
    void can_create_text() {
        Entity app = Starter.createOnlyLocalhostServer(new File(PATH_FOR_TMP_FILES), 8087);

        String name = app.appA.onlyLocalhostServer_createText(List.of(), "foo");

        assertThat(name).isNotEmpty();
    }
    
    @AfterEach
    void afterEach() throws IOException {
        Utils.delete(new File(PATH_FOR_TMP_FILES));
    }

}
