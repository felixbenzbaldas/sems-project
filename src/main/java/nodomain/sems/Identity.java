package nodomain.sems;

import com.fasterxml.jackson.databind.ObjectMapper;
import nodomain.sems.core.ListAspect;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * An identity is an object without members. It only consists of its memory address.
 * The members of this class should be interpreted as aspects which can be assigned to the identity.
 * On the logical level they do not belong to this class.
 **/
public class Identity {
    public String text;
    public ListAspect list;
    public File file;

    public Map<String, Object> data = new HashMap<>();
    private ObjectMapper objectMapper = new ObjectMapper();


    public void set(String property, Object value) {
        Map<String, Object> newData = new HashMap<>(data); // copy
        newData.put(property, value);
        try {
            File propertiesFile = new File(file, "properties.json");
            objectMapper.writeValue(propertiesFile, newData);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        data = newData;
        if (property.equals("text")) {
            text = (String) value;
        }
    }

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
