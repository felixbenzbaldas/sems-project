package nodomain.sems;

import org.junit.jupiter.api.Test;

import java.io.IOException;

import static org.assertj.core.api.Assertions.assertThat;

public class TestCore {

    @Test
    void can_create_core_app() {
        Identity app = Starter.createApp();

        assertThat(app.text).isEqualTo("Sems application");
    }

    @Test
    void can_create_a_list() {
        Identity app = Starter.createApp();

        Identity identity = app.createList();

        assertThat(identity.list.jList).isNotNull();
    }

    @Test
    void test_created_text_has_no_name() {
        Identity app = Starter.createApp();

        Identity identity = app.createText("foo");

        assertThat(identity.name).isNull();
    }

}