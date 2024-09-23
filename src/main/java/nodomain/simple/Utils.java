package nodomain.simple;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Comparator;

public class Utils {

    static public void delete(File file) throws IOException {
        if (file.exists()) {
            Files.walk(file.toPath()).sorted(Comparator.reverseOrder()).map(Path::toFile).forEach(File::delete);
        }
    }

    static public void runMultiplePlatformCommands(String ...commands) {
        String joined = String.join(" &&", commands);
        try {
            Runtime.getRuntime().exec(new String[]{"cmd", "/c", "start cmd.exe /K \"" + joined + " && echo done\""});
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public static void writeToFile(File file, String text) throws FileNotFoundException {
        PrintWriter printWriter = new PrintWriter(file);
        printWriter.write(text);
        printWriter.flush();
    }

    public static String readFromFile(File file) throws IOException {
        return String.join("\n", Files.readAllLines(file.toPath()));
    }
}
