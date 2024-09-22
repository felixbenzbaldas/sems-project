package nodomain.simple;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Comparator;

public class Utils {

    static public void deleteDirectory(File file) throws IOException {
        Files.walk(file.toPath()).sorted(Comparator.reverseOrder()).map(Path::toFile).forEach(File::delete);
    }

    static public void runMultiplePlatformCommands(String ...commands) {
        String joined = String.join(" &&", commands);
        try {
            Runtime.getRuntime().exec(new String[]{"cmd", "/c", "start cmd.exe /K \"" + joined + " && echo done\""});
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
