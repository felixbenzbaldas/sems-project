package nodomain.sems;

import nodomain.sems.core.House;
import nodomain.sems.core.ObjectFilesHouse;
import nodomain.sems.core.SemsObject;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Comparator;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

public class TestTransformer {


    private static final String TEST_RESOURCES_PATH = "./src/test/resources";
    private static final String PATH_FOR_TMP_FILES = TEST_RESOURCES_PATH + "/tmp";

    @BeforeEach
    void beforeEach() {
        new File(PATH_FOR_TMP_FILES).mkdirs();
    }

    @Test
    void testTransformationOfHouseFile() throws IOException {
        File outputDirectory = new File(PATH_FOR_TMP_FILES);
        File houseFile = new File(TEST_RESOURCES_PATH + "/transformer/shAHouse.json");

        new Transformer().transform(houseFile, outputDirectory);

        assertThat(outputDirectory.listFiles().length).isEqualTo(1);
        File houseDirectory = new File(PATH_FOR_TMP_FILES + "/AHouse");
        House house = new ObjectFilesHouse(houseDirectory);
        SemsObject semsObject = house.get("123");
        assertThat(semsObject.get("text")).isEqualTo("foo bar");
        assertThat(semsObject.get("details")).isEqualTo(List.of(
            List.of("AHouse", "567"),
            List.of("AnotherHouse", "789")));
        // TODO relative paths
//        assertThat(semsObject.get("details")).isEqualTo(List.of(
//            List.of("567"),
//            List.of("..", "AnotherHouse", "789")));
    }

    @AfterEach
    void afterEach() throws IOException {
        deleteDirectory(new File(PATH_FOR_TMP_FILES));
    }

    static private void deleteDirectory(File file) throws IOException {
        Files.walk(file.toPath()).sorted(Comparator.reverseOrder()).map(java.nio.file.Path::toFile).forEach(File::delete);
    }
}
