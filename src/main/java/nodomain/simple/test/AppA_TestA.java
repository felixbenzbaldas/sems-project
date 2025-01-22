package nodomain.simple.test;

import com.fasterxml.jackson.databind.ObjectMapper;
import nodomain.simple.Entity;
import nodomain.simple.Starter;
import nodomain.simple.Utils;
import nodomain.simple.core.RandomString;
import nodomain.simple.core.ThrowingFunction;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

public class AppA_TestA {

    private Entity entity;
    public AppA_TestA(Entity entity) {
        this.entity = entity;
    }

    public void createRunAndDisplayTests() {
        List<Entity> successful = new ArrayList<>();
        List<Entity> failed = new ArrayList<>();
        createTests().forEach(test -> {
            boolean result;
            try {
                result = test.test_action.apply(test);
            } catch (Exception e) {
                test.test_result_error = e;
                result = false;
                test.test_result_error.printStackTrace();
            }
            if (result) {
                successful.add(test);
            } else {
                failed.add(test);
            }
        });
        System.out.println("failed: " + failed.size());
        for (Entity failedTest : failed) {
            System.out.println("   " + failedTest.text);
        }
        System.out.println("successful: " + successful.size());
        if (!failed.isEmpty()) {
            throw new RuntimeException("failed");
        }
    }

    private Entity createTest(String name, ThrowingFunction<Entity, Boolean> testAction) {
        Entity test = new Entity();
        test.text = name;
        test.file = new File(this.entity.file, new RandomString().next());
        test.test_action = testAction;
        return test;
    }

    public List<Entity> createTests() {
        return Arrays.asList(
            this.createTest("run multiple platform commands", test -> {
                test.file.mkdirs();

                Utils.runMultiplePlatformCommands("cd " + test.file, "mkdir test");

                Thread.sleep(100);
                return new File(test.file, "test").exists();
            }),
            this.createTest("read/write file", test -> {
                test.file.mkdirs();
                File file = new File(test.file, "tmp");
                file.createNewFile();

                Utils.writeToFile(file, "foo");
                String read = Utils.readFromFile(file);

                return "foo".equals(read);
            }),
            this.createTest("replace in file", test -> {
                test.file.mkdirs();
                File file = new File(test.file, "tmp");
                file.createNewFile();
                Utils.writeToFile(file, "foo-toReplace-bar");

                Utils.replace(file, "toReplace", "replacement");

                String read = Utils.readFromFile(file);
                return read.contains("replacement");
            }),
            this.createTest("read pretty json", test -> {
                File file = new File(Starter.TEST_RESOURCES_PATH + "/prettyJson.txt");
                Object json = new ObjectMapper().readValue(file, Object.class);
                Map<String, Object> jsonMap = (Map<String, Object>) json;
                return jsonMap.containsKey("text") &&
                    jsonMap.containsKey("list");
            }),
            this.createTest("create reduced json string", test -> {
                String jsonString = new ObjectMapper().writeValueAsString(Map.of("text", "foo"));
                return "{\"text\":\"foo\"}".equals(jsonString);
            }),
            this.createTest("escapeJsonString", test -> {
                System.out.println("Start test " + test.text);
                String jsonString = new ObjectMapper().writeValueAsString(Map.of("text", "quote\" newline\n backslash\\end"));
                System.out.println("jsonString        = " + jsonString);

                String escapedJsonString = Starter.createApp().appA.escapeJsonString(jsonString);

                System.out.println("escapedJsonString = " + escapedJsonString);
                String expected = "{\\\"text\\\":\\\"quote\\\\\\\" newline\\\\n backslash\\\\\\\\end\\\"}";
                System.out.println("expected          = " + expected);
                return expected.equals(escapedJsonString);
            }),
            this.createTest("escapeJsonString_decodeEncode", test -> {
                System.out.println("Start test " + test.text);
                String jsonString = new ObjectMapper().writeValueAsString(Map.of("text", "*# * **"));
                System.out.println("jsonString        = " + jsonString);

                String escapedJsonString = Starter.createApp().appA.escapeJsonString(jsonString);

                System.out.println("escapedJsonString = " + escapedJsonString);
                String expected = "{\\\"text\\\":\\\"*# * **\\\"}";
                System.out.println("expected          = " + expected);
                return expected.equals(escapedJsonString);
            })
        );
    }
}
