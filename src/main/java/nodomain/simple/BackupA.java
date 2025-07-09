package nodomain.simple;

import java.util.HashMap;
import java.util.Map;

public class BackupA {

    public Object json;

    public static BackupA createFromJson(Object json) {
        BackupA backupA = new BackupA();
        backupA.json = json;
        System.out.println("has list: " + JSONUtil.has(json, "list"));
        return backupA;
    }

    public void run() {
        System.out.println("the source is : " + JSONUtil.getString(json, "source"));
    }
}
