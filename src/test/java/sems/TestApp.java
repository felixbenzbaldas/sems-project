package sems;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import sems.core.App;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
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
        Path path = Path.of("aStreet", "aHouse", "anObject");
        assertThat(path.subpath(0, 2)).isEqualTo(Path.of("aStreet", "aHouse"));
        assertThat(path.getName(1)).isEqualTo(Path.of("aHouse"));

        Path path2 = path.resolve("aDetail");
        assertThat(path2).isEqualTo(Path.of("aStreet", "aHouse", "anObject", "aDetail"));
        assertThat(path2.getParent()).isEqualTo(path);
    }


    @AfterEach
    void afterEach() throws IOException {
        deleteDirectory(new File(PATH_FOR_TMP_FILES));
    }

    static private void deleteDirectory(File file) throws IOException {
        Files.walk(file.toPath()).sorted(Comparator.reverseOrder()).map(Path::toFile).forEach(File::delete);
    }

}
