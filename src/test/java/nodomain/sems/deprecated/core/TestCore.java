package nodomain.sems.deprecated.core;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

public class TestCore {

    private static final String TEST_RESOURCES_PATH = "./src/test/resources";
    private static final String PATH_FOR_TMP_FILES = TEST_RESOURCES_PATH + "/tmp";

    @BeforeEach
    void beforeEach() {
        new File(PATH_FOR_TMP_FILES).mkdirs();
    }

    @Test
    void can_read_json_file() throws IOException {
        File file = new File(PATH_FOR_TMP_FILES + "/foo/testfile.txt");
        file.getParentFile().mkdirs();
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.writeValue(file, Map.of("aPropertyName", "aValue"));

        Object json = objectMapper.readValue(file, Object.class);
        Map<String, Object> jsonMap = (Map<String, Object>) json;

        assertThat(jsonMap.get("aPropertyName")).isEqualTo("aValue");
    }

    @Test
    void test_house_can_create_object_with_text() throws IOException {
        File houseFile = new File(PATH_FOR_TMP_FILES + "/house");
        House house = new ObjectFilesHouse(houseFile);

        SemsObject semsObject = house.createObjectWithText("foo");

        File file = houseFile.listFiles()[0];
        ObjectMapper objectMapper = new ObjectMapper();
        Object json = objectMapper.readValue(file, Object.class);
        Map<String, Object> jsonMap = (Map<String, Object>) json;
        assertThat(jsonMap.get("text")).isEqualTo("foo");

        assertThat(semsObject.get("text")).isEqualTo("foo");

        assertThat(file.getName()).contains(semsObject.getName());
    }

    @Test
    void test_that_there_is_only_one_handler_for_an_object_file() throws IOException {
        File houseFile = new File(PATH_FOR_TMP_FILES + "/house");
        House house = new ObjectFilesHouse(houseFile);

        SemsObject createdSemsObject = house.createObjectWithText("foo");
        String name = createdSemsObject.getName();
        SemsObject gotSemsObject1 = house.get(name);
        SemsObject gotSemsObject2 = house.get(name);

        assertThat(gotSemsObject1).isSameAs(createdSemsObject);
        assertThat(gotSemsObject1).isSameAs(gotSemsObject2);
    }

    @Test
    void can_create_object_with_text() throws IOException {
        App app = new App(new File(PATH_FOR_TMP_FILES));

        String response = (String) app.handle("createObjectWithText", List.of(List.of("1"), "bar"));

        File file = new File(PATH_FOR_TMP_FILES + "/1").listFiles()[0];
        assertThat(file).exists();
        assertThat(file.getName()).contains(response);
        ObjectMapper objectMapper = new ObjectMapper();
        Object json = objectMapper.readValue(file, Object.class);
        Map<String, Object> jsonMap = (Map<String, Object>) json;
        assertThat(jsonMap.get("text")).isEqualTo("bar");
    }

    @Test
    void can_set_property_at_empty_path() throws IOException {
        App app = new App(new File(PATH_FOR_TMP_FILES));

        app.handle("set", List.of(List.of(), "property", "value"));

        File file = new File(PATH_FOR_TMP_FILES + "/properties.json");
        assertThat(file).exists();
        ObjectMapper objectMapper = new ObjectMapper();
        Object json = objectMapper.readValue(file, Object.class);
        Map<String, Object> jsonMap = (Map<String, Object>) json;
        assertThat(jsonMap.get("property")).isEqualTo("value");
    }
    @AfterEach
    void afterEach() throws IOException {
        deleteDirectory(new File(PATH_FOR_TMP_FILES));
    }

    static private void deleteDirectory(File file) throws IOException {
        Files.walk(file.toPath()).sorted(Comparator.reverseOrder()).map(Path::toFile).forEach(File::delete);
    }
}