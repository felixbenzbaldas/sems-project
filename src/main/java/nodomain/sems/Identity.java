package nodomain.sems;

import nodomain.sems.core.ListAspect;

/**
 * An identity is an object without members. It only consists of its memory address.
 * The members of this class should be interpreted as aspects which can be assigned to the identity.
 * On the logical level they do not belong to this class.
 **/
public class Identity {
    public String text;
    public ListAspect list;


    ////////////////////////////////////////////////////////////////////////
    // app aspect
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
