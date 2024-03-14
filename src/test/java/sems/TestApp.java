package sems;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.*;
public class TestApp {

    @Test
    void testCreateName() {
        SemsHouse semsHouse = new SemsHouse();
        String name1 = semsHouse.createNewSemsName();
        String name2 = semsHouse.createNewSemsName();
        assertThat(name1).isNotNull();
        assertThat(name1).isNotEqualTo(name2);
    }

}
