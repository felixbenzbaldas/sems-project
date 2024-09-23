package nodomain.simple.test;

import nodomain.simple.Entity;
import nodomain.simple.Utils;
import nodomain.simple.core.RandomString;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.function.Function;

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

    public List<Entity> createTests() {
        return Arrays.asList(
            this.createTest("run multiple platform commands", test -> {
                test.file.mkdirs();

                Utils.runMultiplePlatformCommands("cd " + test.file, "mkdir test");

                try {
                    Thread.sleep(100);
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }
                return new File(test.file, "test").exists();
            }),
            this.createTest("read/write file", test -> {
                try {
                    test.file.mkdirs();
                    File file = new File(test.file, "tmp");
                    file.createNewFile();

                    Utils.writeToFile(file, "foo");
                    String read = Utils.readFromFile(file);

                    return "foo".equals(read);
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            }),
            this.createTest("replace in file", test -> {
                try {
                    test.file.mkdirs();
                    File file = new File(test.file, "tmp");
                    file.createNewFile();
                    Utils.writeToFile(file, "foo-toReplace-bar");

                    Utils.replace(file, "toReplace", "replacement");

                    String read = Utils.readFromFile(file);
                    return read.contains("replacement");
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            })
        );
    }

    private Entity createTest(String name, Function<Entity, Boolean> testAction) {
        Entity test = new Entity();
        test.text = name;
        test.file = new File(this.entity.file, new RandomString().next());
        test.test_action = testAction;
        return test;
    }
}
