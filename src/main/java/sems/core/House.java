package sems.core;

import java.io.File;
import java.io.IOException;

public interface House {
    SemsObject createObjectWithText(String text);

    SemsObject get(String name);

    SemsObject createUser(String user, String password);
}
