package nodomain.simple;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

public class TestCore {

    @Test
    void can_create_core_app() {
        Entity app = Starter.createApp();

        assertThat(app.text).isEqualTo("Sems application");
    }

    @Test
    void can_create_a_list() {
        Entity app = Starter.createApp();

        Entity entity = app.createList();

        assertThat(entity.listA.jList).isNotNull();
    }

    @Test
    void test_created_text_has_no_name() {
        Entity app = Starter.createApp();

        Entity entity = app.createText("foo");

        assertThat(entity.name).isNull();
    }

}