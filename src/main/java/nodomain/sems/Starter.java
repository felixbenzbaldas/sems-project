package nodomain.sems;

import nodomain.sems.deprecated.OnlyLocalhostServer;

import java.io.IOException;

public class Starter {

    public static void main(String[] args) throws IOException {
        runDeprecatedServer(args);
    }

    private static void runDeprecatedServer(String[] args) throws IOException {
        OnlyLocalhostServer.main(args);
    }
}
