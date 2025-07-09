package nodomain.simple;

import com.fasterxml.jackson.databind.JsonNode;

import java.nio.file.Path;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
        System.out.println("has list: " + JSONUtil.has(json, "list"));
        System.out.println("list: " + backupA.list.size());
        return backupA;
    }

    public void run() {
        System.out.println("compute path for source: " + computePath("source"));
        list.forEach(BackupA::run);
        if (JSONUtil.has(json, "type")) {
            if (JSONUtil.getString(json, "type").equals("full")) {
                System.out.println("full!!!");
            }
        }
    }

    public Path computePath(String propertyName) {
        Path localPath = Path.of(JSONUtil.getString(json, propertyName));
        if (localPath.isAbsolute()) {
            return localPath;
        } else {
            // TODO how to concat paths?
            return Path.of(context.computePath(propertyName).toString(), localPath.toString());
        }
    }
}
