package nodomain.sems;

import org.assertj.core.api.InstanceOfAssertFactory;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Comparator;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

public class TestOnlyLocalhostServer {


    private static final String TEST_RESOURCES_PATH = "./src/test/resources";
    private static final String PATH_FOR_TMP_FILES = TEST_RESOURCES_PATH + "/tmp";

    @BeforeEach
    void beforeEach() {
        new File(PATH_FOR_TMP_FILES).mkdirs();
    }

    @Test
    void can_create_onlyLocalhostServer() {
        File file = new File(PATH_FOR_TMP_FILES);

        Identity onlyLocalhostServer = Starter.createOnlyLocalhostServer(file, 8085);

        assertThat(onlyLocalhostServer.data.get("port")).isEqualTo(8085);
        assertThat((List<List<String>>) onlyLocalhostServer.data.get("content")).isEmpty();
        assertThat(onlyLocalhostServer.file).isSameAs(file);
    }

    @Test
    void can_load_onlyLocalhostServer() {
        File file = new File(PATH_FOR_TMP_FILES);
        Starter.createOnlyLocalhostServer(file, 8087);

        Identity loaded = Starter.loadApp(file);

        assertThat(loaded.data.get("port")).isEqualTo(8087);
        assertThat((List<List<String>>) loaded.data.get("content")).isEmpty();
        assertThat(loaded.file).isSameAs(file);
    }

    @AfterEach
    void afterEach() throws IOException {
        deleteDirectory(new File(PATH_FOR_TMP_FILES));
    }

    static private void deleteDirectory(File file) throws IOException {
        Files.walk(file.toPath()).sorted(Comparator.reverseOrder()).map(Path::toFile).forEach(File::delete);
    }

}
