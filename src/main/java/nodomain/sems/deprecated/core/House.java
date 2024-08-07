package nodomain.sems.deprecated.core;

public interface House {
    SemsObject createObjectWithText(String text);

    SemsObject get(String name);

    SemsObject createUser(String user, String password);
}
