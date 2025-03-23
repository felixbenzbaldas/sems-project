package nodomain.simple;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.CopyOption;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Comparator;
import java.util.function.Function;
import java.util.stream.Stream;

import static java.nio.file.StandardCopyOption.REPLACE_EXISTING;

public class Utils {

    static public void delete(File file) throws IOException {
        if (file.exists()) {
            Files.walk(file.toPath()).sorted(Comparator.reverseOrder()).map(Path::toFile).forEach(File::delete);
        }
    }

    static public void copyDirectory(Path source, Path target) throws IOException {
        copyDirectory(source, target, true);
    }

    static public void copyDirectory(Path source, Path target, boolean replaceExisting) throws IOException {
        try (Stream<Path> stream = Files.walk(source)) {
            stream.forEach(sourceFile -> {
                if (sourceFile.toFile().isFile()) {
                    Path targetFile = target.resolve(source.relativize(sourceFile));
                    copyFile(sourceFile, targetFile, replaceExisting);
                }
            });
        }
    }

    static public void copyFile(Path source, Path target, boolean replaceExisting) {
        if (replaceExisting) {
            try {
                Files.copy(source, target, REPLACE_EXISTING);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        } else {
            if (!source.toFile().exists()) {
                try {
                    Files.copy(source, target);
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            } else {
                System.out.println("file already exists: " + target.toString());
            }
        }
    }

    static public void runMultiplePlatformCommands(String ...commands) {
        String joined = String.join(" &&", commands);
        try {
            Runtime.getRuntime().exec(new String[]{"cmd", "/c", "start cmd.exe /K \"" + joined + " && exit\""});
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public static void writeToFile(File file, String text) throws FileNotFoundException {
        try (PrintWriter printWriter = new PrintWriter(file)) {
            printWriter.write(text);
            printWriter.flush();
        }
    }

    public static String readFromFile(File file) throws IOException {
        return String.join("\n", Files.readAllLines(file.toPath()));
    }

    public static void replace(File file, String toReplace, String replacement) throws IOException {
        String content = Utils.readFromFile(file);
        Utils.writeToFile(file, content.replace(toReplace, replacement));
    }
}
