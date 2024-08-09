package nodomain.sems;

import nodomain.sems.core.ListAspect;

import java.io.File;

/**
 * An identity is an object without members. It only consists of its memory address.
 * The members of this class should be interpreted as aspects which can be assigned to the identity.
 * On the logical level they do not belong to this class.
 **/
public class Identity {
    public String text;
    public ListAspect list;


    public void set(String propertyName, Object value) {
        if (propertyName.equals("text")) {
            text = (String) value;
        }
    }

    ////////////////////////////////////////////////////////////////////////
    // app aspect

    public File file;

    public Identity createList() {
        Identity identity = this.createIdentitiy();
        identity.list = new ListAspect();
        return identity;
    }

    private Identity createIdentitiy() {
        return new Identity();
    }
    ////////////////////////////////////////////////////////////////////////

}
