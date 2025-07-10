package nodomain.simple;

import com.fasterxml.jackson.databind.JsonNode;

import java.io.IOException;
import java.nio.file.Path;
import java.text.SimpleDateFormat;
import java.util.*;

public class BackupA {

    public Object json;
    public List<BackupA> list = new ArrayList<>();
    public BackupA context;

    public static BackupA createFromJson(Object json) {
        BackupA backupA = new BackupA();
        backupA.json = json;
        if (JSONUtil.has(json, "list")) {
            for (Object subJson : JSONUtil.getList(json, "list")) {
                BackupA subBackupA = createFromJson(subJson);
                backupA.list.add(subBackupA);
                subBackupA.context = backupA;
            }
        }
        return backupA;
    }

    public void run() throws IOException {
        for (BackupA backupA : list) {
            backupA.run();
        }
        if (JSONUtil.has(json, "type")) {
            Path source = computePath("source");
            Path target = computePath("target");
            System.out.println("computed paths: " + source + "    " + target);
            switch (JSONUtil.getString(json, "type")) {
                case "full" -> {
                    String dateString = new SimpleDateFormat("yyMMdd_HH_mm_ss E").format(new Date());
                    Path targetWithTimestamp = target.resolve(dateString);
                    targetWithTimestamp.toFile().mkdir();
                    Utils.copyDirectory(source, targetWithTimestamp);
                }
                case "static" -> {
                    Utils.copyDirectory(source, target, false);
                }
                case "git" -> {
                    String gitExe = JSONUtil.getString(json, "exe");
                    Utils.runMultiplePlatformCommands(
                        "cd \"" + source + "\"",
                        "\"" + gitExe + "\" push --progress \"" + target + "\" main:main",
                        "pause");
                }
            }
        }
    }

    public Path computePath(String propertyName) {
        String localPathString = JSONUtil.getString(json, propertyName);
        if (localPathString == null) localPathString = "";
        Path localPath = Path.of(localPathString);
        System.out.println("localPath = " + localPath);
        if (context == null) {
            return localPath;
        } else {
            // TODO how to concat paths?
            return Path.of(context.computePath(propertyName).toString(), localPath.toString());
        }
    }
}
