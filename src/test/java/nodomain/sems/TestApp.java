package nodomain.sems;

import nodomain.sems.core.App;
import nodomain.sems.core.SemsObject;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

public class TestApp {

    private static final String TEST_RESOURCES_PATH = "./src/test/resources";
    private static final String PATH_FOR_TMP_FILES = TEST_RESOURCES_PATH + "/tmp";

    @BeforeEach
    void beforeEach() {
        new File(PATH_FOR_TMP_FILES).mkdirs();
    }

    @Test
    void canCreateSecurityHash() {
        String toHash = "testpassword";

        String hash = new Security().createSecurityHash(toHash);

        assertThat(hash).isNotEqualTo(toHash);
        assertThat(hash).hasSizeGreaterThan(10);
    }

    @Test
    void canCreateUser() {
        App app = new App(new File(PATH_FOR_TMP_FILES));
        String userName = "aUserName";
        String password = "pw";

        Object response = app.handle("createUser", List.of(userName, password));

        Object json = app.handle("get", List.of(List.of("users", userName)));
        Map<String, Object> jsonMap = (Map<String, Object>) json;
        assertThat((String) jsonMap.get("hash")).hasSizeGreaterThan(10);
        assertThat((String) jsonMap.get("hash")).isNotEqualTo(password);
        assertThat(response).isNull();
    }

    @Test
    void test_path() {
        Path path = new Path(List.of("foo", "bar", "sumi"));

        assertThat(path.getLastPart()).isEqualTo("sumi");
        assertThat(path.withoutLastPart()).isEqualTo(new Path(List.of("foo", "bar")));
        assertThat(path.withoutLastPart()).isNotEqualTo(new Path(List.of("foo", "bar", "sumi")));
    }


    @Test
    void can_store_working_space() {
        App app = new App(new File(PATH_FOR_TMP_FILES));
        String object = app.createObjectWithText(List.of("house1"), "an object");

        app.addObjectToWorkingSpace(List.of("house1", object));

        App app2 = new App(new File(PATH_FOR_TMP_FILES));
        assertThat(app2.getObjectsInWorkingPlace()).hasSize(1);
    }

    @AfterEach
    void afterEach() throws IOException {
        deleteDirectory(new File(PATH_FOR_TMP_FILES));
    }

    static private void deleteDirectory(File file) throws IOException {
        Files.walk(file.toPath()).sorted(Comparator.reverseOrder()).map(java.nio.file.Path::toFile).forEach(File::delete);
    }

}
