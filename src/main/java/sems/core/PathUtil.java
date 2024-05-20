package sems.core;

import java.io.File;
import java.nio.file.Path;
import java.util.List;
import java.util.stream.Collectors;

public class PathUtil {
    static public Path fromList(List<String> list) {
        return Path.of(String.join(File.separator, list));
    }

    static public String getName(Path path) {
        int indexOfLastName = path.getNameCount() - 1;
        return path.getName(indexOfLastName).toString();
    }
}
