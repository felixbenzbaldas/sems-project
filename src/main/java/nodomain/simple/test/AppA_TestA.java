package nodomain.simple.test;

import nodomain.simple.Entity;

import java.io.IOException;

public class AppA_TestA {

    private Entity entity;
    public AppA_TestA(Entity entity) {
        this.entity = entity;
    }

    public void run() {
        System.out.println("human-test: build client");
        execute("cd ./client", "npm run build");
    }

    public void execute(String ...commands) {
        String joined = String.join(" &&", commands);
        try {
            Runtime.getRuntime().exec(new String[]{"cmd", "/c", "start cmd.exe /K \"" + joined + " && echo done\""});
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
